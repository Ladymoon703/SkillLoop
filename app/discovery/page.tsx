"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import type { DiscoverSkill } from "@/lib/ai";
import { LevelBar } from "@/components/ui";

const QUESTIONS = [
  "朋友经常找你帮什么忙？",
  "你最近独立解决过什么问题？",
  "什么事情你觉得自己比身边人做得更好？",
];

const EXAMPLES = [
  ["帮我修电脑、写爬虫、调代码", "自动整理了几百张照片", "讲技术问题比同事更清楚"],
  ["教同事做 Excel 报表", "用 AI 工具搞定了周报", "做 PPT 汇报总是被夸"],
  ["帮我拍照、修图", "给旅行剪了个 vlog", "拍照构图比朋友好"],
];

type Msg = { role: "ai" | "user"; text: string };

export default function Discovery() {
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "ai", text: QUESTIONS[0] }]);
  const [input, setInput] = useState("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [skills, setSkills] = useState<DiscoverSkill[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [exampleIdx, setExampleIdx] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, skills]);

  async function send(text?: string) {
    const value = (text ?? input).trim();
    if (!value || loading) return;
    const newAnswers = [...answers, value];
    const nextMsgs: Msg[] = [...msgs, { role: "user", text: value }];
    setMsgs(nextMsgs);
    setInput("");
    setAnswers(newAnswers);

    if (newAnswers.length < QUESTIONS.length) {
      setMsgs([...nextMsgs, { role: "ai", text: QUESTIONS[newAnswers.length] }]);
    } else {
      setLoading(true);
      setMsgs([...nextMsgs, { role: "ai", text: "正在分析你的技能画像…" }]);
      try {
        const res = await fetch("/api/ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers: newAnswers }),
        });
        const data = await res.json();
        setSkills(data.skills ?? []);
        setMsgs((m) => [...m.slice(0, -1), { role: "ai", text: "我帮你发现了这些技能，看看准不准 👇" }]);
      } catch {
        setSkills([]);
        setMsgs((m) => [...m.slice(0, -1), { role: "ai", text: "网络有点问题，但你可以先查看示例技能画像 👇" }]);
      } finally {
        setLoading(false);
      }
    }
  }

  function useExample() {
    const e = EXAMPLES[exampleIdx % EXAMPLES.length];
    send(e[answers.length] ?? e[0]);
  }

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-8 lg:grid-cols-5">
      {/* 聊天区 */}
      <div className="lg:col-span-3">
        <h1 className="text-2xl font-bold">AI 技能发现</h1>
        <p className="mt-1 text-zinc-400">回答 3 个问题，AI 帮你发现隐藏技能</p>

        <div className="glass mt-6 flex h-[520px] flex-col rounded-3xl">
          <div className="flex-1 space-y-4 overflow-y-auto p-5">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                {m.role === "ai" ? (
                  <div className="flex items-start gap-2">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-sm">
                      ◈
                    </span>
                    <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-white/[0.06] px-4 py-3 text-sm text-zinc-200">
                      {m.text}
                    </div>
                  </div>
                ) : (
                  <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-gradient-to-br from-violet-600 to-fuchsia-600 px-4 py-3 text-sm text-white">
                    {m.text}
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-1 text-zinc-400">
                <span className="animate-pulse-glow">AI 思考中</span>
                <span className="animate-pulse">…</span>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="border-t border-white/5 p-4">
            {!skills ? (
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                  placeholder="输入你的回答…"
                  className="flex-1 rounded-xl bg-white/[0.06] px-4 py-3 text-sm outline-none placeholder:text-zinc-500 focus:bg-white/[0.09]"
                />
                <button onClick={() => send()} className="btn-primary rounded-xl px-5 text-sm font-semibold">
                  发送
                </button>
                <button onClick={useExample} className="rounded-xl glass px-3 text-sm text-zinc-300 hover:text-white">
                  用示例
                </button>
              </div>
            ) : (
              <Link href="/skills" className="btn-primary block rounded-xl py-3 text-center font-semibold">
                确认技能画像 ✓
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* 技能画像 */}
      <div className="lg:col-span-2">
        <div className="glass rounded-3xl p-6">
          <h2 className="font-bold">我的技能画像</h2>
          {!skills ? (
            <div className="mt-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 animate-pulse rounded-2xl bg-white/[0.04]" />
              ))}
              <p className="pt-4 text-center text-sm text-zinc-500">完成左侧问答后，这里会逐步生成</p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {skills.map((s) => (
                <div key={s.name} className="animate-fade-up rounded-2xl bg-white/[0.04] p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{s.name}</span>
                  </div>
                  <div className="mt-2">
                    <LevelBar level={s.level} />
                  </div>
                  <p className="mt-2 text-sm text-zinc-400">{s.summary}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {s.directions.map((d) => (
                      <span key={d} className="rounded-full bg-violet-500/15 px-2 py-0.5 text-xs text-violet-300">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
