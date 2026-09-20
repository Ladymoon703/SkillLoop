"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { exchange, getUser, coachSuggestions } from "@/lib/data";
import { useStore } from "@/lib/store";
import { Avatar } from "@/components/ui";

export default function CoachPage() {
  const { exchanges } = useStore();
  const ex = exchanges[0] ?? exchange;
  const partner = getUser(ex.b);
  const doneCount = ex.tasks.filter((t) => t.status === "done").length;
  const progress = Math.round((doneCount / ex.tasks.length) * 100);
  const todayTasks = ex.tasks.filter((t) => t.status !== "done");
  const week = ex.plan[0];

  const [suggestions, setSuggestions] = useState<string[]>(coachSuggestions);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch("/api/coach", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        goal: ex.goal,
        doneCount,
        totalCount: ex.tasks.length,
        doneTitles: ex.tasks
          .filter((t) => t.status === "done")
          .map((t) => t.title),
        todoTitles: ex.tasks
          .filter((t) => t.status !== "done")
          .map((t) => t.title),
        partnerName: partner.name,
      }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled && Array.isArray(d.suggestions) && d.suggestions.length) {
          setSuggestions(d.suggestions);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [doneCount, ex.tasks.length, exchange.goal, partner.name]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      {/* 头部 */}
      <div className="flex items-center gap-4">
        <div className="animate-float">
          <Avatar user={partner} size={56} />
        </div>
        <div>
          <h1 className="text-2xl font-bold">AI Learning Coach</h1>
          <p className="text-zinc-400">你的专属学习教练 · 正在和 {partner.name} 一起学习</p>
        </div>
      </div>

      {/* 学习目标 + 进度 */}
      <div className="glass mt-6 rounded-3xl p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-bold">当前学习目标</h2>
          <span className="text-sm text-zinc-400">总进度 {progress}%</span>
        </div>
        <p className="text-gradient mt-2 text-lg font-semibold">{ex.goal}</p>
        <div className="mt-4 h-2 rounded-full bg-white/10">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-400 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* 本周任务 */}
        <div className="glass rounded-3xl p-6">
          <h2 className="font-bold">本周任务 · {week.title}</h2>
          <ul className="mt-4 space-y-2.5">
            {week.tasks.map((t) => (
              <li key={t} className="flex items-center gap-3 text-sm text-zinc-300">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-fuchsia-400" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        {/* 今日任务 */}
        <div className="glass rounded-3xl p-6">
          <h2 className="font-bold">今日任务</h2>
          <ul className="mt-4 space-y-3">
            {todayTasks.map((t) => {
              const teacher = getUser(t.by);
              return (
                <li key={t.id} className="flex items-center gap-3 rounded-2xl bg-white/[0.03] p-3">
                  <Avatar user={teacher} size={32} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold">{t.title}</div>
                    <div className="text-xs text-zinc-500">
                      {t.minutes}分钟 · {t.coin} Coin · {t.due}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* AI 建议 */}
      <div className="glass mt-6 rounded-3xl p-6">
        <div className="flex items-center gap-2">
          <span className="glow-ring inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-sm">
            ◈
          </span>
          <h2 className="font-bold">AI 学习建议</h2>
          {loading && <span className="text-xs text-zinc-500">生成中…</span>}
        </div>
        <ul className="mt-4 space-y-3">
          {suggestions.map((s, i) => (
            <li key={i} className="flex items-start gap-3 rounded-2xl bg-white/[0.03] p-4">
              <span className="text-fuchsia-400">✦</span>
              <span className="text-sm text-zinc-300">{s}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <Link
          href={`/exchanges/${ex.id}`}
          className="btn-primary inline-block rounded-xl px-6 py-3 font-semibold"
        >
          查看交换详情 →
        </Link>
      </div>
    </div>
  );
}
