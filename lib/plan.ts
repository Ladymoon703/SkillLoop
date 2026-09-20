import {
  getUser,
  getSkill,
  teachSkills,
  learnSkills,
  users,
  type Exchange,
  type Task,
} from "@/lib/data";

function intersect(a: string[], b: string[]): string[] {
  return a.filter((x) => b.includes(x));
}

// 根据「我教的 ∩ 对方想学」和「对方教的 ∩ 我想学」推导双方交换的技能。
export function resolveSkills(userId: string, partnerId: string) {
  const partner = getUser(partnerId);
  const myTeach = teachSkills(userId).map((s) => s.skillId);
  const myLearn = learnSkills(userId).map((s) => s.skillId);
  const pTeach = teachSkills(partnerId).map((s) => s.skillId);
  const pLearn = learnSkills(partnerId).map((s) => s.skillId);

  const teachAB = intersect(myTeach, pLearn)[0] ?? "python"; // 我 → 对方
  const teachBA = intersect(pTeach, myLearn)[0] ?? "photo"; // 对方 → 我

  return {
    id: `${userId}-${partnerId}`,
    partner,
    teachAB,
    teachBA,
    teachABName: getSkill(teachAB).name,
    teachBAName: getSkill(teachBA).name,
  };
}

export function buildTasks(
  id: string,
  userId: string,
  partnerId: string,
  teachABName: string,
  teachBAName: string
): Task[] {
  return [
    { id: `${id}-t1`, exchangeId: id, title: `20分钟${teachBAName}教学：基础入门`, by: partnerId, for: userId, status: "confirm", minutes: 20, coin: 20, due: "今天" },
    { id: `${id}-t2`, exchangeId: id, title: `20分钟${teachABName}教学：入门`, by: userId, for: partnerId, status: "doing", minutes: 20, coin: 20, due: "明天" },
    { id: `${id}-t3`, exchangeId: id, title: `${teachBAName}作业：完成一次练习`, by: partnerId, for: userId, status: "todo", minutes: 30, coin: 30, due: "本周六" },
    { id: `${id}-t4`, exchangeId: id, title: `${teachABName}作业：完成一个小任务`, by: userId, for: partnerId, status: "todo", minutes: 30, coin: 30, due: "本周六" },
  ];
}

export function defaultPlan(
  teachABName: string,
  teachBAName: string
): Exchange["plan"] {
  return [
    { week: "Week 1", title: `${teachBAName}入门`, tasks: [`${teachBAName}基础概念`, `20分钟${teachBAName}实操`, `20分钟${teachABName}入门`] },
    { week: "Week 2", title: "核心技巧", tasks: [`${teachBAName}核心技巧`, `一次${teachBAName}练习`, `${teachABName}基础语法`] },
    { week: "Week 3", title: "实战应用", tasks: [`${teachBAName}实战练习`, `复盘与调整`, `${teachABName}进阶练习`] },
    { week: "Week 4", title: "成果展示", tasks: [`完成一个${teachBAName}作品`, `${teachABName}小项目`, `总结与互评`] },
  ];
}

// Mock 版：确定性地生成完整交换（无需 API Key）。
export function generateExchange(userId: string, partnerId: string): Exchange {
  const s = resolveSkills(userId, partnerId);
  return {
    id: s.id,
    a: userId,
    b: partnerId,
    teachAB: s.teachABName,
    teachBA: s.teachBAName,
    status: "active",
    goal: `30天学会${s.teachBAName} · 同时帮 ${s.partner.name} 入门 ${s.teachABName}`,
    plan: defaultPlan(s.teachABName, s.teachBAName),
    tasks: buildTasks(s.id, userId, partnerId, s.teachABName, s.teachBAName),
  };
}

// 找到与 userId 双向技能互补的第一个用户（无则返回 null）。
export function findBestPartner(userId: string): string | null {
  const myTeach = teachSkills(userId).map((s) => s.skillId);
  const myLearn = learnSkills(userId).map((s) => s.skillId);
  for (const u of users) {
    if (u.id === userId) continue;
    const pTeach = teachSkills(u.id).map((s) => s.skillId);
    const pLearn = learnSkills(u.id).map((s) => s.skillId);
    const iTeachThem = intersect(myTeach, pLearn).length > 0;
    const theyTeachMe = intersect(pTeach, myLearn).length > 0;
    if (iTeachThem && theyTeachMe) return u.id;
  }
  return null;
}
