import Link from "next/link";
import {
  getUser,
  getSkill,
  teachSkills,
  learnSkills,
  matches,
} from "@/lib/data";
import { Avatar, LevelDots, SkillTag } from "@/components/ui";

export default function MatchPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-bold">AI 智能匹配</h1>
      <p className="mt-1 text-zinc-400">
        不只是分数——AI 告诉你 <span className="text-violet-300">为什么匹配</span>
      </p>

      <div className="mt-6 space-y-5">
        {matches.map((m) => {
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

                  <div className="mt-4 flex gap-3">
                    <Link
                      href="/exchanges/alex-mia"
                      className="btn-primary rounded-xl px-5 py-2.5 text-sm font-semibold"
                    >
                      开始交换
                    </Link>
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
