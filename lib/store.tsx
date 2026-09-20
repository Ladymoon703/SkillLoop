"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  currentUserId as defaultUserId,
  exchange,
  getUser,
  txs as seedTxs,
  userSkills as seedUserSkills,
  type Exchange,
  type Task,
  type Tx,
  type User,
  type UserSkill,
} from "@/lib/data";
import { generateExchange, findBestPartner } from "@/lib/plan";

type Stats = User["stats"];

export type StoreState = {
  currentUserId: string; // 当前登录用户
  exchanges: Exchange[]; // 当前用户的交换（每个含 plan + tasks）
  txs: Tx[]; // 流水（追加）
  coin: number; // 当前用户余额
  stats: Stats; // 当前用户统计
  userSkills: UserSkill[]; // 技能可变副本（增删改作用于此）
};

const STORAGE_KEY = "skillloop:state:v4";

const NEXT: Record<Task["status"], Task["status"]> = {
  todo: "doing",
  doing: "confirm",
  confirm: "done",
  done: "done",
};

function cloneExchange(e: Exchange): Exchange {
  return {
    ...e,
    plan: e.plan.map((p) => ({ ...p, tasks: [...p.tasks] })),
    tasks: e.tasks.map((t) => ({ ...t })),
  };
}

function seedState(userId: string): StoreState {
  const me = getUser(userId);
  const exchanges: Exchange[] = [];
  if (userId === defaultUserId) {
    // 默认用户（Alex）用丰富种子交换
    exchanges.push(cloneExchange(exchange));
  } else {
    const partner = findBestPartner(userId);
    if (partner) exchanges.push(generateExchange(userId, partner));
  }
  return {
    currentUserId: userId,
    exchanges,
    txs: userId === defaultUserId ? [...seedTxs] : [],
    coin: me.coin,
    stats: { ...me.stats },
    userSkills: [...seedUserSkills],
  };
}

function loadState(): StoreState {
  if (typeof window === "undefined") return seedState(defaultUserId);
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedState(defaultUserId);
    const parsed = JSON.parse(raw) as StoreState;
    if (
      !parsed ||
      typeof parsed.currentUserId !== "string" ||
      !Array.isArray(parsed.exchanges) ||
      !Array.isArray(parsed.txs) ||
      !Array.isArray(parsed.userSkills)
    ) {
      return seedState(defaultUserId);
    }
    return parsed;
  } catch {
    return seedState(defaultUserId);
  }
}

function findTask(
  exchanges: Exchange[],
  taskId: string
): { exchangeIdx: number; task: Task } | null {
  for (let i = 0; i < exchanges.length; i++) {
    const task = exchanges[i].tasks.find((t) => t.id === taskId);
    if (task) return { exchangeIdx: i, task };
  }
  return null;
}

export type SettleResult = { settled: boolean; isTeach: boolean; coin: number };

type StoreContextValue = StoreState & {
  tasks: Task[]; // 派生：所有交换任务的扁平列表
  skillsOf: (userId: string, type: "teach" | "learn") => UserSkill[];
  addUserSkill: (type: "teach" | "learn", skillId: string) => void;
  removeUserSkill: (type: "teach" | "learn", skillId: string) => void;
  setSkillLevel: (skillId: string, level: number) => void;
  advanceTask: (taskId: string) => SettleResult | null;
  createExchange: (partnerId: string, exchange?: Exchange) => string;
  switchUser: (userId: string) => void;
  resetDemo: () => void;
};

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoreState>(() => seedState(defaultUserId));

  // 挂载后从 localStorage 恢复存档
  useEffect(() => {
    setState(loadState());
  }, []);

  // 每次变更同步写回
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);

  const value = useMemo<StoreContextValue>(() => {
    const tasks = state.exchanges.flatMap((e) => e.tasks);
    const uid = state.currentUserId;
    return {
      ...state,
      tasks,
      skillsOf(userId: string, type: "teach" | "learn") {
        return state.userSkills.filter(
          (s) => s.userId === userId && s.type === type
        );
      },
      addUserSkill(type: "teach" | "learn", skillId: string) {
        const cur = uid;
        setState((prev) => {
          const exists = prev.userSkills.some(
            (s) => s.userId === cur && s.skillId === skillId && s.type === type
          );
          if (exists) return prev;
          const added: UserSkill =
            type === "teach"
              ? { userId: cur, skillId, type, level: 1, desc: "新添加的技能" }
              : { userId: cur, skillId, type, goal: "设定一个学习目标" };
          return { ...prev, userSkills: [...prev.userSkills, added] };
        });
      },
      removeUserSkill(type: "teach" | "learn", skillId: string) {
        const cur = uid;
        setState((prev) => ({
          ...prev,
          userSkills: prev.userSkills.filter(
            (s) => !(s.userId === cur && s.skillId === skillId && s.type === type)
          ),
        }));
      },
      setSkillLevel(skillId: string, level: number) {
        const cur = uid;
        setState((prev) => ({
          ...prev,
          userSkills: prev.userSkills.map((s) =>
            s.userId === cur && s.skillId === skillId && s.type === "teach"
              ? { ...s, level: Math.min(5, Math.max(1, level)) }
              : s
          ),
        }));
      },
      advanceTask(taskId: string) {
        const found = findTask(state.exchanges, taskId);
        if (!found) return null;
        const t = found.task;
        if (t.status === "done") return null;

        const isTeach = t.by === uid;
        const willSettle = t.status === "confirm";

        setState((prev) => {
          const f = findTask(prev.exchanges, taskId);
          if (!f) return prev;
          const cur = f.task;
          if (cur.status === "done") return prev;

          const status = NEXT[cur.status];
          const exchanges = prev.exchanges.map((e, i) =>
            i === f.exchangeIdx
              ? {
                  ...e,
                  tasks: e.tasks.map((x) =>
                    x.id === taskId ? { ...x, status } : x
                  ),
                }
              : e
          );

          if (status !== "done") return { ...prev, exchanges };

          // confirm → done：结算一次
          const curIsTeach = cur.by === prev.currentUserId;
          const amount = curIsTeach ? cur.coin : -cur.coin;
          const tx: Tx = {
            id: crypto.randomUUID(),
            amount,
            desc: curIsTeach
              ? `完成教学 · ${cur.title}`
              : `完成学习 · ${cur.title}`,
            time: "刚刚",
          };
          return {
            ...prev,
            exchanges,
            coin: prev.coin + amount,
            txs: [tx, ...prev.txs],
            stats: {
              ...prev.stats,
              tasks: prev.stats.tasks + 1,
              teaching: prev.stats.teaching + (curIsTeach ? 1 : 0),
              // 学习时长：仅学习任务累计，向上取整保证 20 分钟也有可见增长
              hours:
                prev.stats.hours +
                (curIsTeach ? 0 : Math.max(1, Math.round(cur.minutes / 60))),
            },
          };
        });

        return willSettle
          ? { settled: true, isTeach, coin: t.coin }
          : { settled: false, isTeach, coin: t.coin };
      },
      createExchange(partnerId: string, exchange?: Exchange) {
        const ex = exchange ?? generateExchange(uid, partnerId);
        const existing = state.exchanges.find((e) => e.id === ex.id);
        if (existing) return existing.id;
        setState((prev) => ({ ...prev, exchanges: [ex, ...prev.exchanges] }));
        return ex.id;
      },
      switchUser(userId: string) {
        setState(seedState(userId));
      },
      resetDemo() {
        try {
          window.localStorage.removeItem(STORAGE_KEY);
        } catch {
          /* ignore */
        }
        setState(seedState(defaultUserId));
      },
    };
  }, [state]);

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
