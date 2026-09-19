import Link from "next/link";
import { loops, getUser, getSkill, teachSkills, learnSkills } from "@/lib/data";

type Node = { id: string; x: number; y: number };

const nodes: Node[] = [
  { id: "alex", x: 320, y: 90 },
  { id: "mia", x: 100, y: 360 },
  { id: "ken", x: 540, y: 360 },
];

export default function LoopPage() {
  const loop = loops[0];
  const pos = Object.fromEntries(nodes.map((n) => [n.id, n]));

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="text-center">
        <span className="glass glow-ring rounded-full px-4 py-1.5 text-sm text-violet-300">
          ✦ 产品核心创新
        </span>
        <h1 className="mt-4 text-3xl font-bold sm:text-4xl">{loop.title}</h1>
        <p className="mx-auto mt-3 max-w-2xl text-zinc-400">{loop.desc}</p>
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
          {loop.edges.map((e) => {
            const f = pos[e.from];
            const t = pos[e.to];
            const fx = e.from === "alex" ? f.x + 30 : e.from === "mia" ? f.x + 40 : f.x - 40;
            const fy = e.from === "alex" ? f.y + 45 : f.y;
            const tx = e.to === "alex" ? t.x - 30 : e.to === "mia" ? t.x + 40 : t.x - 40;
            const ty = e.to === "alex" ? t.y + 45 : t.y;
            const mx = (fx + tx) / 2;
            const my = (fy + ty) / 2 + (e.from === "ken" || e.to === "ken" ? 24 : -8);
            return (
              <g key={e.skill}>
                <line
                  x1={fx} y1={fy} x2={tx} y2={ty}
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
          {nodes.map((n) => {
            const u = getUser(n.id);
            const teach = teachSkills(n.id)[0];
            const learn = learnSkills(n.id)[0];
            const teachName = getSkill(teach.skillId).name;
            const learnName = getSkill(learn.skillId).name;
            const w = 150;
            const h = 92;
            const x = n.x - w / 2;
            const y = n.y - h / 2;
            return (
              <g key={n.id}>
                <rect
                  x={x} y={y} width={w} height={h} rx={16}
                  fill="rgba(255,255,255,0.04)"
                  stroke={n.id === "alex" ? "#a78bfa" : "rgba(255,255,255,0.15)"}
                  strokeWidth={n.id === "alex" ? 1.5 : 1}
                />
                <text x={n.x} y={y + 26} textAnchor="middle" fontSize="22">{u.emoji}</text>
                <text x={n.x} y={y + 44} textAnchor="middle" fontSize="14" fontWeight="700" fill="#fff">
                  {u.name}
                </text>
                <text x={n.x} y={y + 64} textAnchor="middle" fontSize="12" fill="#a78bfa">
                  教 {teachName}
                </text>
                <text x={n.x} y={y + 82} textAnchor="middle" fontSize="12" fill="#22d3ee">
                  想学 {learnName}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* 解释 */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {loop.edges.map((e) => {
          const f = getUser(e.from);
          const t = getUser(e.to);
          return (
            <div key={e.skill} className="glass rounded-2xl p-4 text-center">
              <div className="text-sm text-zinc-400">
                {f.name} <span className="text-violet-300">教</span> {t.name}
              </div>
              <div className="mt-1 font-bold text-gradient">{e.skill}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex flex-col items-center gap-3">
        <Link href="/exchanges/alex-mia" className="btn-primary rounded-xl px-8 py-3 font-semibold">
          加入这个交换闭环 →
        </Link>
        <p className="text-xs text-zinc-500">三人各取所需，无需真实货币</p>
      </div>
    </div>
  );
}
