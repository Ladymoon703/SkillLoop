import {
  getUser,
  getSkill,
  teachSkills,
  learnSkills,
  badges,
  ratings,
} from "@/lib/data";
import { Avatar, LevelBar, SkillTag } from "@/components/ui";

export default function PassportView({ userId }: { userId: string }) {
  const u = getUser(userId);
  const teach = teachSkills(userId);
  const learn = learnSkills(userId);
  const received = ratings.filter((r) => r.to === userId);
  const isMe = userId === "alex";

  const stats = [
    { label: "教学次数", value: u.stats.teaching },
    { label: "学习时长", value: `${u.stats.hours}h` },
    { label: "完成任务", value: u.stats.tasks },
    { label: "完成交换", value: u.stats.exchanges },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      {/* 头部数字名片 */}
      <div className="glass glow-ring rounded-3xl p-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <div className="animate-float">
            <Avatar user={u} size={96} />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center gap-2 sm:justify-start">
              <h1 className="text-3xl font-bold">{u.name}</h1>
              {u.online && (
                <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-300">
                  在线
                </span>
              )}
            </div>
            <p className="mt-1 text-zinc-400">{u.handle} · {u.bio}</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
              <span className="rounded-full glass px-3 py-1 text-sm">
                <span className="text-amber-300">●</span> {u.coin} Skill Coin
              </span>
              {u.times.map((t) => (
                <span key={t} className="rounded-full glass px-3 py-1 text-sm text-zinc-300">
                  🕐 {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="glass rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-gradient">{s.value}</div>
              <div className="mt-1 text-sm text-zinc-400">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 技能 */}
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="glass rounded-3xl p-6">
          <h2 className="font-bold">我能教</h2>
          <div className="mt-4 space-y-4">
            {teach.map((s) => {
              const sk = getSkill(s.skillId);
              return (
                <div key={s.skillId} className="rounded-2xl bg-white/[0.03] p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{sk.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{sk.name}</span>
                      </div>
                      {s.level && <LevelBar level={s.level} />}
                    </div>
                  </div>
                  {s.aiSummary && (
                    <p className="mt-2 text-sm text-zinc-400">{s.aiSummary}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass rounded-3xl p-6">
          <h2 className="font-bold">我想学</h2>
          <div className="mt-4 space-y-3">
            {learn.map((s) => {
              const sk = getSkill(s.skillId);
              return (
                <div key={s.skillId} className="rounded-2xl bg-white/[0.03] p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{sk.icon}</span>
                    <div className="flex-1">
                      <span className="font-semibold">{sk.name}</span>
                      {s.goal && <p className="text-sm text-zinc-400">{s.goal}</p>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <h2 className="mt-6 font-bold">徽章</h2>
          <div className="mt-4 space-y-3">
            {badges.map((b) => (
              <div key={b.name} className="flex items-center gap-3 rounded-2xl bg-white/[0.03] p-3">
                <span className="text-2xl">{b.icon}</span>
                <div>
                  <div className="font-semibold">{b.name}</div>
                  <div className="text-xs text-zinc-400">{b.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 收到的评价 */}
      <div className="glass mt-6 rounded-3xl p-6">
        <h2 className="font-bold">收到的评价</h2>
        {received.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-500">还没有收到评价</p>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {received.map((r) => {
              const from = getUser(r.from);
              return (
                <div key={r.exchangeId + r.from} className="rounded-2xl bg-white/[0.03] p-4">
                  <div className="flex items-center gap-3">
                    <Avatar user={from} size={36} />
                    <div className="flex-1">
                      <span className="font-semibold">{from.name}</span>
                      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-zinc-400">
                        <span>教学质量 {r.quality}★</span>
                        <span>准时 {r.punctuality}★</span>
                        <span>沟通 {r.communication}★</span>
                      </div>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-zinc-300">{r.comment}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {isMe && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm text-zinc-400">
          {teach.map((s) => (
            <SkillTag key={s.skillId} icon={getSkill(s.skillId).icon} name={getSkill(s.skillId).name} color={getSkill(s.skillId).color} />
          ))}
          <span>· 持续成长中</span>
        </div>
      )}
    </div>
  );
}
