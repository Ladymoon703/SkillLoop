"use client";

import { useState } from "react";
import { getUser, getSkill, skills } from "@/lib/data";
import { useStore } from "@/lib/store";
import { LevelBar } from "@/components/ui";

export default function SkillsPage() {
  const {
    currentUserId,
    skillsOf,
    addUserSkill,
    removeUserSkill,
    setSkillLevel,
  } = useStore();
  const me = getUser(currentUserId);
  const teach = skillsOf(currentUserId, "teach");
  const learn = skillsOf(currentUserId, "learn");

  const teachIds = new Set(teach.map((s) => s.skillId));
  const learnIds = new Set(learn.map((s) => s.skillId));
  const availableTeach = skills.filter((s) => !teachIds.has(s.id));
  const availableLearn = skills.filter((s) => !learnIds.has(s.id));

  const [teachAdd, setTeachAdd] = useState<string>(availableTeach[0]?.id ?? "");
  const [learnAdd, setLearnAdd] = useState<string>(availableLearn[0]?.id ?? "");

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-bold">我的技能</h1>
      <p className="mt-1 text-zinc-400">管理你能教的技能与想学的技能</p>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* 我能教 */}
        <div className="glass rounded-3xl p-6">
          <h2 className="font-bold">我能教</h2>
          {availableTeach.length > 0 && (
            <div className="mt-3 flex gap-2">
              <select
                value={teachAdd}
                onChange={(e) => setTeachAdd(e.target.value)}
                className="min-w-0 flex-1 rounded-lg bg-white/5 px-3 py-1.5 text-sm text-zinc-200 outline-none"
              >
                {availableTeach.map((s) => (
                  <option key={s.id} value={s.id} className="bg-[#0b0b12]">
                    {s.icon} {s.name}
                  </option>
                ))}
              </select>
              <button
                onClick={() => addUserSkill("teach", teachAdd)}
                className="rounded-lg bg-violet-500/20 px-3 py-1.5 text-sm font-semibold text-violet-200 hover:bg-violet-500/30"
              >
                添加
              </button>
            </div>
          )}
          <div className="mt-4 space-y-3">
            {teach.map((s) => {
              const sk = getSkill(s.skillId);
              const lv = s.level ?? 1;
              return (
                <div key={s.skillId} className="glass-hover rounded-2xl bg-white/[0.04] p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{sk.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{sk.name}</span>
                        <button
                          onClick={() => removeUserSkill("teach", s.skillId)}
                          className="text-xs text-zinc-500 hover:text-rose-300"
                        >
                          删除
                        </button>
                      </div>
                      <div className="mt-2 flex items-center gap-3">
                        <LevelBar level={lv} />
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setSkillLevel(s.skillId, lv - 1)}
                            className="h-6 w-6 rounded-md bg-white/10 text-sm text-zinc-300 hover:bg-white/20"
                          >
                            −
                          </button>
                          <button
                            onClick={() => setSkillLevel(s.skillId, lv + 1)}
                            className="h-6 w-6 rounded-md bg-white/10 text-sm text-zinc-300 hover:bg-white/20"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      {s.aiSummary && <p className="mt-2 text-sm text-zinc-400">{s.aiSummary}</p>}
                      {s.directions && s.directions.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {s.directions.map((d) => (
                            <span key={d} className="rounded-full bg-violet-500/15 px-2 py-0.5 text-xs text-violet-300">
                              {d}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 我想学 */}
        <div className="glass rounded-3xl p-6">
          <h2 className="font-bold">我想学</h2>
          {availableLearn.length > 0 && (
            <div className="mt-3 flex gap-2">
              <select
                value={learnAdd}
                onChange={(e) => setLearnAdd(e.target.value)}
                className="min-w-0 flex-1 rounded-lg bg-white/5 px-3 py-1.5 text-sm text-zinc-200 outline-none"
              >
                {availableLearn.map((s) => (
                  <option key={s.id} value={s.id} className="bg-[#0b0b12]">
                    {s.icon} {s.name}
                  </option>
                ))}
              </select>
              <button
                onClick={() => addUserSkill("learn", learnAdd)}
                className="rounded-lg bg-fuchsia-500/20 px-3 py-1.5 text-sm font-semibold text-fuchsia-200 hover:bg-fuchsia-500/30"
              >
                添加
              </button>
            </div>
          )}
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
                        <button
                          onClick={() => removeUserSkill("learn", s.skillId)}
                          className="text-xs text-zinc-500 hover:text-rose-300"
                        >
                          删除
                        </button>
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
