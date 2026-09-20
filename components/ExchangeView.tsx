"use client";

import { useState } from "react";
import { getUser, teachSkills, learnSkills, getSkill, exchange as seedExchange, type Task } from "@/lib/data";
import { useStore } from "@/lib/store";
import { Avatar, LevelDots } from "@/components/ui";

const STATUS: Record<Task["status"], { label: string; cls: string }> = {
  todo: { label: "待开始", cls: "bg-zinc-500/15 text-zinc-300" },
  doing: { label: "进行中", cls: "bg-sky-500/15 text-sky-300" },
  confirm: { label: "待确认", cls: "bg-amber-500/15 text-amber-300" },
  done: { label: "已完成", cls: "bg-emerald-500/15 text-emerald-300" },
};

const ACTION: Record<Task["status"], string> = {
  todo: "开始",
  doing: "完成",
  confirm: "确认完成",
  done: "已完成",
};

export default function ExchangeView({ exchangeId }: { exchangeId: string }) {
  const { exchanges, advanceTask, currentUserId } = useStore();
  const exchange = exchanges.find((e) => e.id === exchangeId) ?? seedExchange;
  const tasks = exchange.tasks;
  const a = getUser(exchange.a);
  const b = getUser(exchange.b);
  const [toast, setToast] = useState<string | null>(null);

  // 以当前用户视角渲染「你」与「伙伴」
  const iAmA = currentUserId === exchange.a;
  const me = iAmA ? a : b;
  const other = iAmA ? b : a;
  const meTeaches = iAmA ? exchange.teachAB : exchange.teachBA;
  const otherTeaches = iAmA ? exchange.teachBA : exchange.teachAB;

  const doneCount = tasks.filter((t) => t.status === "done").length;
  const progress = Math.round((doneCount / tasks.length) * 100);

  function handleAdvance(taskId: string) {
    const res = advanceTask(taskId);
    if (res?.settled) {
      setToast(
        res.isTeach
          ? `✅ 完成教学，+${res.coin} Skill Coin`
          : `✅ 确认学习，-${res.coin} Skill Coin`
      );
      setTimeout(() => setToast(null), 2500);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      {/* 双方信息 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <UserCard user={me} role="你" teach={meTeaches} />
        <UserCard user={other} role="伙伴" teach={otherTeaches} />
      </div>

      {/* 交换目标 */}
      <div className="glass mt-4 rounded-3xl p-6">
        <h2 className="font-bold">交换目标</h2>
        <p className="mt-2 text-zinc-300">{exchange.goal}</p>
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-zinc-400">
            <span>完成进度</span>
            <span>{progress}%</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-white/10">
            <div className="h-2 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-400 transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      {/* 学习计划 */}
      <div className="mt-6">
        <h2 className="text-xl font-bold">AI 学习计划</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {exchange.plan.map((p) => (
            <div key={p.week} className="glass glass-hover rounded-2xl p-5">
              <div className="text-sm font-semibold text-violet-300">{p.week}</div>
              <div className="mt-1 font-bold">{p.title}</div>
              <ul className="mt-3 space-y-1.5">
                {p.tasks.map((t) => (
                  <li key={t} className="flex items-start gap-2 text-sm text-zinc-400">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-fuchsia-400" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* 任务 */}
      <div className="mt-6">
        <h2 className="text-xl font-bold">当前任务</h2>
        <div className="mt-4 space-y-3">
          {tasks.map((t) => {
            const st = STATUS[t.status];
            const teacher = getUser(t.by);
            return (
              <div key={t.id} className="glass flex items-center gap-4 rounded-2xl p-4">
                <Avatar user={teacher} size={40} />
                <div className="min-w-0 flex-1">
                  <div className="font-semibold">{t.title}</div>
                  <div className="mt-0.5 text-xs text-zinc-500">
                    {t.minutes}分钟 · {t.coin} Coin · {t.due}
                  </div>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${st.cls}`}>{st.label}</span>
                {t.status !== "done" && (
                  <button
                    onClick={() => handleAdvance(t.id)}
                    className="btn-primary rounded-xl px-4 py-2 text-sm font-semibold"
                  >
                    {ACTION[t.status]}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 双方确认 */}
      <div className="glass mt-6 flex flex-col items-center gap-4 rounded-3xl p-6 text-center">
        <p className="text-zinc-400">双方确认完成后，Skill Coin 才会结算</p>
        <div className="flex items-center gap-3">
          <button className="btn-primary rounded-xl px-6 py-3 font-semibold">我已确认本次交换 ✓</button>
        </div>
        <p className="text-xs text-zinc-500">教学 30 分钟 → +30 Coin · 学习 30 分钟 → -30 Coin</p>
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full glass glow-ring px-5 py-3 text-sm font-semibold">
          {toast}
        </div>
      )}
    </div>
  );
}

function UserCard({ user, role, teach }: { user: ReturnType<typeof getUser>; role: string; teach: string }) {
  const teachS = teachSkills(user.id);
  const learnS = learnSkills(user.id);
  return (
    <div className="glass rounded-3xl p-6">
      <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">{role}</div>
      <div className="mt-3 flex items-center gap-4">
        <Avatar user={user} size={56} />
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold">{user.name}</span>
            <LevelDots level={teachS[0]?.level ?? 1} />
          </div>
          <p className="text-sm text-zinc-400">{user.bio}</p>
        </div>
      </div>
      <div className="mt-4 space-y-2 text-sm">
        <div className="flex flex-wrap gap-1.5">
          <span className="text-zinc-500">教：</span>
          {teachS.map((s) => (
            <span key={s.skillId} className="text-zinc-200">{getSkill(s.skillId).icon} {getSkill(s.skillId).name}</span>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          <span className="text-zinc-500">学：</span>
          {learnS.map((s) => (
            <span key={s.skillId} className="text-zinc-200">{getSkill(s.skillId).icon} {getSkill(s.skillId).name}</span>
          ))}
        </div>
      </div>
      <div className="mt-4 rounded-2xl bg-white/[0.03] p-3 text-center text-sm">
        <span className="text-zinc-400">本交换中教授</span>{" "}
        <span className="font-semibold text-gradient">{teach}</span>
      </div>
    </div>
  );
}
