"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getUser,
  getSkill,
  teachSkills,
  learnSkills,
  matches,
  type Match,
} from "@/lib/data";
import { useStore } from "@/lib/store";
import { Avatar, LevelDots, SkillTag } from "@/components/ui";

export default function MatchPage() {
  const router = useRouter();
  const { createExchange, currentUserId } = useStore();
  const [matchList, setMatchList] = useState<Match[]>(matches);
  const [loading, setLoading] = useState(false);
  const [starting, setStarting] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/match?userId=${currentUserId}`)
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled && Array.isArray(d.matches) && d.matches.length) {
          setMatchList(d.matches);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [currentUserId]);

  async function startExchange(partnerId: string) {
    setStarting(partnerId);
    let id: string | null = null;
    try {
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId, partnerId }),
      });
      const data = await res.json();
      if (data?.exchange?.id) {
        id = createExchange(partnerId, data.exchange);
      }
    } catch {
      // 降级到同步 Mock
    }
    if (!id) {
      id = createExchange(partnerId);
    }
    setStarting(null);
    router.push(`/exchanges/${id}`);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-bold">AI 智能匹配</h1>
      <p className="mt-1 text-zinc-400">
        不只是分数——AI 告诉你 <span className="text-violet-300">为什么匹配</span>
        {loading && <span className="ml-2 text-xs text-zinc-500">AI 分析中…</span>}
      </p>

      <div className="mt-6 space-y-5">
        {matchList.map((m) => {
          const u = getUser(m.userId);
          const teach = teachSkills(m.userId);
          const learn = learnSkills(m.userId);
          return (
            <div key={m.userId} className="glass glass-hover rounded-3xl p-6">
              <div className="flex flex-col gap-5 sm:flex-row">
                <div className="flex items-start gap-4 sm:w-64 sm:shrink-0">
                  <Avatar user={u} size={64} />
                  <div>
                    <div className="font-bold">{u.name}</div>
                    <div className="text-xs text-zinc-500">{u.handle}</div>
                    <div className="mt-2"><LevelDots level={teach[0]?.level ?? 1} /></div>
                    <div className="mt-1 text-xs text-zinc-500">🕐 {m.timeMatch}</div>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-fuchsia-300">{m.score}% 匹配</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <span className="text-sm text-zinc-500">能教：</span>
                    {teach.map((s) => {
                      const sk = getSkill(s.skillId);
                      return <SkillTag key={s.skillId} icon={sk.icon} name={sk.name} color={sk.color} />;
                    })}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <span className="text-sm text-zinc-500">想学：</span>
                    {learn.map((s) => {
                      const sk = getSkill(s.skillId);
                      return (
                        <span key={s.skillId} className="text-sm text-zinc-300">
                          {sk.icon} {sk.name}
                        </span>
                      );
                    })}
                  </div>

                  <div className="mt-4 rounded-2xl bg-white/[0.03] p-4">
                    <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      为什么匹配
                    </div>
                    <ul className="mt-2 space-y-1.5">
                      {m.reasons.map((r) => (
                        <li key={r} className="flex items-start gap-2 text-sm text-zinc-300">
                          <span className="mt-0.5 text-fuchsia-400">✦</span>
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {m.timeMatch.includes("线下") && (
                    <div className="mt-3 rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs text-amber-300">
                      ⚠️ 首次线下交流建议选择公共场所
                    </div>
                  )}

                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => startExchange(m.userId)}
                      disabled={starting === m.userId}
                      className="btn-primary rounded-xl px-5 py-2.5 text-sm font-semibold disabled:opacity-60"
                    >
                      {starting === m.userId ? "生成计划中…" : "开始交换"}
                    </button>
                    <Link
                      href={`/passport/${m.userId}`}
                      className="rounded-xl glass px-5 py-2.5 text-sm font-semibold text-zinc-200 hover:text-white"
                    >
                      查看 Passport
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
