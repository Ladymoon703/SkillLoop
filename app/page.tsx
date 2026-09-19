import Link from "next/link";
import {
  currentUserId,
  getUser,
  getSkill,
  teachSkills,
  matches,
  loops,
  exchange,
} from "@/lib/data";
import { Avatar, SkillTag } from "@/components/ui";

export default function Home() {
  const loop = loops[0];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Hero */}
      <section className="flex flex-col items-center py-8 text-center sm:py-14">
        <div className="glass glow-ring animate-fade-up rounded-full px-4 py-1.5 text-sm text-zinc-200">
          ✨ 用你的技能，换取你想学的技能
        </div>
        <h1 className="mt-6 animate-fade-up text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
          今天，你想<span className="text-gradient">学会什么</span>？
        </h1>
        <p className="mt-4 max-w-xl animate-fade-up text-zinc-400">
          SkillLoop 通过 AI 发现你的技能价值，帮你找到真正互补的学习伙伴，完成技能交换。
        </p>
        <div className="glass mt-8 flex w-full max-w-xl animate-fade-up items-center gap-2 rounded-2xl p-2">
          <input
            className="flex-1 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-zinc-500"
            placeholder="例如：我想学摄影，我能教 Python…"
          />
          <Link
            href="/discovery"
            className="btn-primary whitespace-nowrap rounded-xl px-5 py-3 text-sm font-semibold"
          >
            开始探索 →
          </Link>
        </div>
      </section>

      {/* 三步 */}
      <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          ["🔍", "发现技能", "AI 帮你挖掘隐藏技能"],
          ["🤝", "找到伙伴", "AI 匹配真正互补的伙伴"],
          ["🚀", "完成交换", "AI 制定计划，任务驱动成长"],
        ].map(([icon, title, desc]) => (
          <div key={title} className="glass glass-hover rounded-2xl p-5">
            <div className="text-2xl">{icon}</div>
            <div className="mt-2 font-semibold">{title}</div>
            <p className="mt-1 text-sm text-zinc-400">{desc}</p>
          </div>
        ))}
      </section>

      {/* 内容区 */}
      <section className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* 推荐伙伴 */}
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">为你推荐的学习伙伴</h2>
            <Link href="/match" className="text-sm text-violet-300 hover:text-violet-200">
              查看全部 →
            </Link>
          </div>
          {matches.slice(0, 2).map((m) => {
            const u = getUser(m.userId);
            const teach = teachSkills(m.userId);
            return (
              <Link key={m.userId} href="/match" className="glass glass-hover block rounded-2xl p-5">
                <div className="flex items-start gap-4">
                  <Avatar user={u} size={52} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{u.name}</span>
                      <span className="text-xs text-zinc-500">{u.handle}</span>
                      <span className="ml-auto text-xs font-semibold text-fuchsia-300">
                        {m.score}% 匹配
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {teach.map((t) => {
                        const sk = getSkill(t.skillId);
                        return <SkillTag key={t.skillId} icon={sk.icon} name={sk.name} color={sk.color} />;
                      })}
                    </div>
                    <p className="mt-2 text-sm text-zinc-400">{m.reasons[0]}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* 闭环 + 今日任务 */}
        <div className="space-y-4">
          <Link href="/loop" className="glass glass-hover block rounded-2xl border-violet-400/30 p-5">
            <span className="text-xs font-semibold text-violet-300">AI 智能发现</span>
            <h3 className="mt-1 font-bold">{loop.title}</h3>
            <p className="mt-2 text-sm text-zinc-400">{loop.desc}</p>
            <div className="mt-3 flex items-center gap-2 text-sm text-zinc-300">
              {loop.members.map((id) => {
                const u = getUser(id);
                return (
                  <span key={id} className="flex items-center gap-1">
                    <Avatar user={u} size={20} />
                    {u.name}
                  </span>
                );
              })}
            </div>
          </Link>

          <div className="glass rounded-2xl p-5">
            <h3 className="font-bold">今日学习任务</h3>
            <ul className="mt-3 space-y-3">
              {exchange.tasks
                .filter((t) => t.status !== "done")
                .slice(0, 3)
                .map((t) => (
                  <li key={t.id} className="flex items-center gap-3">
                    <span className="h-2 w-2 shrink-0 rounded-full bg-fuchsia-400" />
                    <span className="flex-1 text-sm text-zinc-300">{t.title}</span>
                    <span className="text-xs text-zinc-500">{t.due}</span>
                  </li>
                ))}
            </ul>
            <Link
              href={`/exchanges/${exchange.id}`}
              className="btn-primary mt-4 block rounded-xl py-2.5 text-center text-sm font-semibold"
            >
              进入交换 →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
