import {
  currentUserId,
  getUser,
  getSkill,
  teachSkills,
  learnSkills,
} from "@/lib/data";
import { LevelBar } from "@/components/ui";

export default function SkillsPage() {
  const me = getUser(currentUserId);
  const teach = teachSkills(currentUserId);
  const learn = learnSkills(currentUserId);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-bold">我的技能</h1>
      <p className="mt-1 text-zinc-400">管理你能教的技能与想学的技能</p>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* 我能教 */}
        <div className="glass rounded-3xl p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-bold">我能教</h2>
            <button className="rounded-full glass px-3 py-1 text-sm text-violet-300 hover:text-white">
              + 添加
            </button>
          </div>
          <div className="mt-4 space-y-3">
            {teach.map((s) => {
              const sk = getSkill(s.skillId);
              return (
                <div key={s.skillId} className="glass-hover rounded-2xl bg-white/[0.04] p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{sk.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{sk.name}</span>
                        <button className="text-xs text-zinc-500 hover:text-white">编辑</button>
                      </div>
                      {s.level && <div className="mt-2"><LevelBar level={s.level} /></div>}
                      <p className="mt-2 text-sm text-zinc-400">{s.aiSummary}</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {s.directions?.map((d) => (
                          <span key={d} className="rounded-full bg-violet-500/15 px-2 py-0.5 text-xs text-violet-300">
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 我想学 */}
        <div className="glass rounded-3xl p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-bold">我想学</h2>
            <button className="rounded-full glass px-3 py-1 text-sm text-violet-300 hover:text-white">
              + 添加
            </button>
          </div>
          <div className="mt-4 space-y-3">
            {learn.map((s) => {
              const sk = getSkill(s.skillId);
              return (
                <div key={s.skillId} className="glass-hover rounded-2xl bg-white/[0.04] p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{sk.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{sk.name}</span>
                        <button className="text-xs text-zinc-500 hover:text-white">删除</button>
                      </div>
                      <p className="mt-1 text-sm text-zinc-400">{s.goal}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 rounded-2xl bg-white/[0.03] p-4">
            <div className="font-semibold">偏好设置</div>
            <div className="mt-3 space-y-2 text-sm text-zinc-300">
              <div className="flex items-center justify-between">
                <span>教学方式</span>
                <span className="text-zinc-400">线上为主</span>
              </div>
              <div className="flex items-center justify-between">
                <span>可用时间</span>
                <span className="text-zinc-400">{me.times.join(" · ")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
