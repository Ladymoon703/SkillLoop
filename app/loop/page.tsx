"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loops, getUser, getSkill, teachSkills, learnSkills, type Loop } from "@/lib/data";
import { useStore } from "@/lib/store";

export default function LoopPage() {
  const { exchanges } = useStore();
  const [loop, setLoop] = useState<Loop>(loops[0]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch("/api/loop")
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled && d?.loop) setLoop(d.loop);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const members = loop.members;
  const n = members.length || 1;
  const cx = 320;
  const cy = 230;
  const r = 150;
  const pos: Record<string, { x: number; y: number }> = {};
  members.forEach((id, i) => {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2;
    pos[id] = { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });
  const primaryId = exchanges[0]?.id ?? "alex-mia";

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="text-center">
        <span className="glass glow-ring rounded-full px-4 py-1.5 text-sm text-violet-300">
          ✦ 产品核心创新
        </span>
        <h1 className="mt-4 text-3xl font-bold sm:text-4xl">{loop.title}</h1>
        <p className="mx-auto mt-3 max-w-2xl text-zinc-400">
          {loading ? "AI 正在分析技能闭环…" : loop.desc}
        </p>
      </div>

      {/* 关系图 */}
      <div className="glass mt-8 rounded-3xl p-4">
        <svg viewBox="0 0 640 460" className="w-full">
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#a78bfa" />
            </marker>
            <linearGradient id="edge" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
          </defs>

          {/* 边 */}
          {loop.edges.map((e, i) => {
            const f = pos[e.from];
            const t = pos[e.to];
            if (!f || !t) return null;
            const mx = (f.x + t.x) / 2;
            const my = (f.y + t.y) / 2 - 14;
            return (
              <g key={`${e.from}-${e.to}-${i}`}>
                <line
                  x1={f.x} y1={f.y} x2={t.x} y2={t.y}
                  stroke="url(#edge)" strokeWidth="3" markerEnd="url(#arrow)"
                  strokeLinecap="round"
                />
                <text
                  x={mx} y={my}
                  textAnchor="middle" fontSize="14" fontWeight="700" fill="#e4e4e7"
                  stroke="#05050a" strokeWidth="4" paintOrder="stroke"
                >
                  {e.skill}
                </text>
              </g>
            );
          })}

          {/* 节点 */}
          {members.map((id) => {
            const u = getUser(id);
            const p = pos[id];
            if (!p) return null;
            const teach = teachSkills(id)[0];
            const learn = learnSkills(id)[0];
            const teachName = teach ? getSkill(teach.skillId).name : "";
            const learnName = learn ? getSkill(learn.skillId).name : "";
            const w = 150;
            const h = 92;
            const x = p.x - w / 2;
            const y = p.y - h / 2;
            return (
              <g key={id}>
                <rect
                  x={x} y={y} width={w} height={h} rx={16}
                  fill="rgba(255,255,255,0.04)"
                  stroke={id === members[0] ? "#a78bfa" : "rgba(255,255,255,0.15)"}
                  strokeWidth={id === members[0] ? 1.5 : 1}
                />
                <text x={p.x} y={y + 26} textAnchor="middle" fontSize="22">{u.emoji}</text>
                <text x={p.x} y={y + 44} textAnchor="middle" fontSize="14" fontWeight="700" fill="#fff">
                  {u.name}
                </text>
                <text x={p.x} y={y + 64} textAnchor="middle" fontSize="12" fill="#a78bfa">
                  教 {teachName}
                </text>
                <text x={p.x} y={y + 82} textAnchor="middle" fontSize="12" fill="#22d3ee">
                  想学 {learnName}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* 解释 */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {loop.edges.map((e, i) => {
          const f = getUser(e.from);
          const t = getUser(e.to);
          return (
            <div key={`${e.from}-${e.to}-${i}`} className="glass rounded-2xl p-4 text-center">
              <div className="text-sm text-zinc-400">
                {f.name} <span className="text-violet-300">教</span> {t.name}
              </div>
              <div className="mt-1 font-bold text-gradient">{e.skill}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex flex-col items-center gap-3">
        <Link href={`/exchanges/${primaryId}`} className="btn-primary rounded-xl px-8 py-3 font-semibold">
          加入这个交换闭环 →
        </Link>
        <p className="text-xs text-zinc-500">多人各取所需，无需真实货币</p>
      </div>
    </div>
  );
}
