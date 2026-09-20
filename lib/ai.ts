import {
  currentUserId,
  users,
  getSkill,
  teachSkills,
  learnSkills,
  matches as seedMatches,
  loops as seedLoops,
  type Exchange,
  type Loop,
  type Match,
} from "@/lib/data";
import { generateExchange, resolveSkills, buildTasks } from "@/lib/plan";

export type DiscoverSkill = {
  name: string;
  level: number;
  summary: string;
  directions: string[];
};

const DEEPSEEK_URL = "https://api.deepseek.com/chat/completions";
const MODEL = "deepseek-chat";

const KEYWORDS: [RegExp, DiscoverSkill][] = [
  [/python|代码|程序|爬虫|脚本|自动化|后端|开发/i, { name: "Python", level: 4, summary: "能从零讲解 Python 基础，并指导脚本自动化与爬虫实战", directions: ["零基础入门", "自动化脚本", "爬虫"] }],
  [/ai|人工智能|chatgpt|大模型|提示词|prompt|gpt/i, { name: "AI工具", level: 3, summary: "熟练使用主流 AI 工具提效，能教提示词工程与工作流", directions: ["AI 提效", "提示词工程"] }],
  [/excel|表格|数据|透视|函数|统计/i, { name: "Excel", level: 4, summary: "精通函数、透视表与数据可视化", directions: ["函数", "透视表", "数据看板"] }],
  [/摄影|拍照|相机|构图|调色|照片/i, { name: "摄影", level: 3, summary: "掌握构图与光线基础，能拍出有质感的照片", directions: ["构图", "光线", "人像"] }],
  [/视频|剪辑|剪映|pr|vlog|后期|短片/i, { name: "视频剪辑", level: 3, summary: "能把素材剪出节奏与故事感", directions: ["剪映", "节奏", "Vlog"] }],
  [/ppt|演示|汇报|幻灯片|课件/i, { name: "PPT", level: 3, summary: "擅长结构化表达与简洁排版", directions: ["职场汇报", "逻辑排版"] }],
  [/ps|设计|海报|p图|修图|photoshop/i, { name: "PS", level: 3, summary: "能做海报与修图设计", directions: ["海报", "修图"] }],
  [/英语|english|翻译|口语|雅思|托福/i, { name: "英语", level: 4, summary: "英语表达流利，能进行口语与写作教学", directions: ["口语", "写作", "考试"] }],
  [/日语|日文|动漫|japanese/i, { name: "日语", level: 3, summary: "掌握日语基础，能进行日常会话教学", directions: ["五十音", "会话"] }],
  [/韩语|韩文|韩剧|korean/i, { name: "韩语", level: 3, summary: "掌握韩语基础，能进行日常会话教学", directions: ["发音", "会话"] }],
  [/吉他|乐器|弹唱|指弹|和弦|乐理/i, { name: "吉他", level: 4, summary: "能教吉他弹唱与基础指弹", directions: ["弹唱", "指弹", "乐理"] }],
  [/健身|运动|减脂|增肌|锻炼|体态/i, { name: "健身", level: 4, summary: "能制定科学训练计划，指导增肌减脂", directions: ["增肌", "减脂", "体态"] }],
  [/做饭|烹饪|做菜|美食|烘焙|家常菜/i, { name: "做饭", level: 3, summary: "能做一手好菜，能教家常菜与快手菜", directions: ["家常菜", "快手菜", "烘焙"] }],
];

function mockDiscover(answers: string[]): DiscoverSkill[] {
  const text = answers.join(" ");
  const found = KEYWORDS.filter(([re]) => re.test(text)).map(([, s]) => s);
  const unique = found.filter((s, i) => found.findIndex((x) => x.name === s.name) === i);
  const result = unique.slice(0, 3);
  if (result.length === 0) {
    return [
      { name: "Python", level: 4, summary: "能从零讲解 Python 基础，并指导脚本自动化", directions: ["零基础入门", "自动化脚本"] },
      { name: "Excel", level: 3, summary: "熟练使用函数与透视表处理数据", directions: ["函数", "透视表"] },
    ];
  }
  return result;
}

export async function discoverSkills(answers: string[]): Promise<DiscoverSkill[]> {
  const key = process.env.DEEPSEEK_API_KEY;
  if (key) {
    try {
      const system =
        "你是技能发现助手。根据用户的三段回答，推断用户可能拥有的 2-3 项可教授技能。只输出 JSON，格式：{\"skills\":[{\"name\":\"技能名\",\"level\":1到5的整数,\"summary\":\"一句话总结\",\"directions\":[\"可教授方向\"]}]}";
      const user = `用户回答：\n1. 朋友常找我帮忙：${answers[0]}\n2. 我最近独立解决过：${answers[1]}\n3. 我比身边人做得更好：${answers[2]}`;
      const res = await fetch(DEEPSEEK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: "system", content: system },
            { role: "user", content: user },
          ],
          temperature: 0.3,
          response_format: { type: "json_object" },
        }),
      });
      const data = await res.json();
      const content = data.choices?.[0]?.message?.content;
      if (content) {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed.skills)) return parsed.skills;
      }
    } catch {
      // 降级到 Mock
    }
  }
  return mockDiscover(answers);
}

export type CoachInput = {
  goal: string;
  doneCount: number;
  totalCount: number;
  doneTitles: string[];
  todoTitles: string[];
  partnerName: string;
};

function mockCoachFeedback(input: CoachInput): string[] {
  const { goal, doneCount, totalCount, doneTitles, todoTitles, partnerName } =
    input;
  const s: string[] = [];
  if (doneCount === 0) {
    s.push(
      `你的目标是「${goal}」，建议先和 ${partnerName} 约好时间，完成第一个任务。`
    );
  } else if (doneCount < totalCount) {
    s.push(`已完成 ${doneCount}/${totalCount} 个任务，节奏很好，继续保持。`);
    const next = todoTitles[0];
    if (next) s.push(`下一步建议完成「${next}」，趁热打铁。`);
  } else {
    s.push(`本交换 ${totalCount} 个任务已全部完成，可以进入总结与互评。`);
  }
  const lastDone = doneTitles[doneTitles.length - 1];
  if (lastDone) s.push(`刚完成的「${lastDone}」记得让对方点评，反馈是最好的进步。`);
  s.push("每次练习后花几分钟记录要点，Skill Passport 会见证你的成长。");
  return s.slice(0, 4);
}

export async function coachFeedback(input: CoachInput): Promise<string[]> {
  const key = process.env.DEEPSEEK_API_KEY;
  if (key) {
    try {
      const system =
        "你是 AI 学习教练。根据用户当前交换的进度与任务，给出 3-4 条简短、具体、可执行的学习建议。只输出 JSON，格式：{\"suggestions\":[\"建议1\",\"建议2\"]}";
      const user = `学习目标：${input.goal}\n伙伴：${input.partnerName}\n进度：已完成 ${input.doneCount}/${input.totalCount} 个任务\n已完成任务：${input.doneTitles.join("、") || "无"}\n待完成任务：${input.todoTitles.join("、") || "无"}`;
      const res = await fetch(DEEPSEEK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: "system", content: system },
            { role: "user", content: user },
          ],
          temperature: 0.5,
          response_format: { type: "json_object" },
        }),
      });
      const data = await res.json();
      const content = data.choices?.[0]?.message?.content;
      if (content) {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed.suggestions)) return parsed.suggestions;
      }
    } catch {
      // 降级到 Mock
    }
  }
  return mockCoachFeedback(input);
}

function buildMatchPrompt(userId: string): string {
  const me = users.find((u) => u.id === userId)!;
  const myTeach = teachSkills(userId);
  const myLearn = learnSkills(userId);
  const parts: string[] = [];
  parts.push(`当前用户：${me.name}`);
  parts.push(
    `能教：${myTeach.map((s) => `${getSkill(s.skillId).name}(Lv.${s.level ?? 1})`).join("、") || "无"}`
  );
  parts.push(
    `想学：${myLearn.map((s) => getSkill(s.skillId).name).join("、") || "无"}`
  );
  parts.push(`可用时间：${me.times.join("、")}`);
  parts.push("候选用户：");
  for (const u of users) {
    if (u.id === userId) continue;
    const t = teachSkills(u.id);
    const l = learnSkills(u.id);
    parts.push(
      `- ${u.name}(${u.id})：能教 ${t.map((s) => `${getSkill(s.skillId).name}(Lv.${s.level ?? 1})`).join("、") || "无"}；想学 ${l.map((s) => getSkill(s.skillId).name).join("、") || "无"}；时间 ${u.times.join("、")}`
    );
  }
  return parts.join("\n");
}

function mockMatches(userId: string): Match[] {
  if (userId === currentUserId) return seedMatches;
  const myTeach = teachSkills(userId);
  const myLearn = learnSkills(userId);
  const results: Match[] = [];
  for (const u of users) {
    if (u.id === userId) continue;
    const pTeach = teachSkills(u.id);
    const pLearn = learnSkills(u.id);
    const iTeach = myTeach.filter((s) => pLearn.some((x) => x.skillId === s.skillId));
    const theyTeach = pTeach.filter((s) => myLearn.some((x) => x.skillId === s.skillId));
    if (iTeach.length && theyTeach.length) {
      results.push({
        userId: u.id,
        score: 86 + iTeach.length * 2 + theyTeach.length * 2,
        timeMatch: `${u.times[0] ?? "灵活"} · 线上`,
        reasons: [
          `你可以教 ${iTeach.map((s) => getSkill(s.skillId).name).join("、")}，${u.name} 正在学`,
          `${u.name} 擅长 ${theyTeach.map((s) => getSkill(s.skillId).name).join("、")}，而你正在学`,
          `双方可用时间有交集：${u.times.join("、")}`,
        ],
      });
    }
  }
  return results.slice(0, 3);
}

export async function matchPartners(userId: string): Promise<Match[]> {
  const key = process.env.DEEPSEEK_API_KEY;
  if (key) {
    try {
      const system =
        "你是技能交换匹配助手。根据当前用户与候选用户的技能互补性，找出最匹配的 3 个候选用户。只输出 JSON：{\"matches\":[{\"userId\":\"用户id\",\"score\":0到100整数,\"timeMatch\":\"推荐时间\",\"reasons\":[\"为什么匹配\"]}]}";
      const user = buildMatchPrompt(userId);
      const res = await fetch(DEEPSEEK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: "system", content: system },
            { role: "user", content: user },
          ],
          temperature: 0.3,
          response_format: { type: "json_object" },
        }),
      });
      const data = await res.json();
      const content = data.choices?.[0]?.message?.content;
      if (content) {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed.matches)) {
          const valid: Match[] = parsed.matches
            .filter(
              (m: any) =>
                m &&
                typeof m.userId === "string" &&
                Array.isArray(m.reasons) &&
                typeof m.score === "number"
            )
            .filter((m: any) => users.some((u) => u.id === m.userId))
            .map((m: any) => ({
              userId: m.userId,
              score: Math.round(m.score),
              timeMatch: typeof m.timeMatch === "string" ? m.timeMatch : "",
              reasons: m.reasons.map((r: any) => String(r)),
            }));
          if (valid.length) return valid;
        }
      }
    } catch {
      // 降级到 Mock
    }
  }
  return mockMatches(userId);
}

export async function generatePlanAI(
  userId: string,
  partnerId: string
): Promise<Exchange> {
  const key = process.env.DEEPSEEK_API_KEY;
  if (key) {
    try {
      const s = resolveSkills(userId, partnerId);
      const system =
        "你是技能交换的 AI 学习教练。为一次双向技能交换制定 4 周学习计划。只输出 JSON：{\"goal\":\"一句话目标\",\"plan\":[{\"week\":\"Week 1\",\"title\":\"周标题\",\"tasks\":[\"任务1\",\"任务2\",\"任务3\"]}]}";
      const user = `A 教 B「${s.teachABName}」，B 教 A「${s.teachBAName}」。请生成学习目标与 4 周计划。`;
      const res = await fetch(DEEPSEEK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: "system", content: system },
            { role: "user", content: user },
          ],
          temperature: 0.5,
          response_format: { type: "json_object" },
        }),
      });
      const data = await res.json();
      const content = data.choices?.[0]?.message?.content;
      if (content) {
        const parsed = JSON.parse(content);
        const goal = typeof parsed.goal === "string" ? parsed.goal : "";
        const plan: Exchange["plan"] = Array.isArray(parsed.plan)
          ? parsed.plan
              .filter(
                (p: any) =>
                  p &&
                  typeof p.week === "string" &&
                  typeof p.title === "string" &&
                  Array.isArray(p.tasks)
              )
              .map((p: any) => ({
                week: p.week,
                title: p.title,
                tasks: p.tasks.map((t: any) => String(t)),
              }))
          : [];
        if (goal && plan.length) {
          return {
            id: s.id,
            a: userId,
            b: partnerId,
            teachAB: s.teachABName,
            teachBA: s.teachBAName,
            status: "active",
            goal,
            plan,
            tasks: buildTasks(s.id, userId, partnerId, s.teachABName, s.teachBAName),
          };
        }
      }
    } catch {
      // 降级到 Mock
    }
  }
  return generateExchange(userId, partnerId);
}

function buildUsersContext(): string {
  return users
    .map((u) => {
      const t = teachSkills(u.id);
      const l = learnSkills(u.id);
      return `- ${u.name}(${u.id})：能教 ${t.map((s) => getSkill(s.skillId).name).join("、") || "无"}；想学 ${l.map((s) => getSkill(s.skillId).name).join("、") || "无"}`;
    })
    .join("\n");
}

export async function discoverLoop(): Promise<Loop> {
  const key = process.env.DEEPSEEK_API_KEY;
  if (key) {
    try {
      const system =
        "你是技能交换平台的 AI。根据所有用户的技能（能教/想学），找出一个 3 人技能交换闭环 A→B→C→A（A 教 B、B 教 C、C 教 A）。只输出 JSON：{\"title\":\"标题\",\"members\":[\"userId\"],\"edges\":[{\"from\":\"userId\",\"to\":\"userId\",\"skill\":\"技能名\"}],\"desc\":\"一句话解释\"}";
      const user = buildUsersContext();
      const res = await fetch(DEEPSEEK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: "system", content: system },
            { role: "user", content: user },
          ],
          temperature: 0.3,
          response_format: { type: "json_object" },
        }),
      });
      const data = await res.json();
      const content = data.choices?.[0]?.message?.content;
      if (content) {
        const parsed = JSON.parse(content);
        const members: string[] = Array.isArray(parsed.members)
          ? parsed.members.filter((m: any) => users.some((u) => u.id === m))
          : [];
        const edges: Loop["edges"] = Array.isArray(parsed.edges)
          ? parsed.edges
              .filter(
                (e: any) =>
                  e &&
                  typeof e.from === "string" &&
                  typeof e.to === "string" &&
                  typeof e.skill === "string"
              )
              .map((e: any) => ({ from: e.from, to: e.to, skill: e.skill }))
          : [];
        if (typeof parsed.title === "string" && members.length >= 3 && edges.length >= 3) {
          return {
            title: parsed.title,
            members,
            edges,
            desc: typeof parsed.desc === "string" ? parsed.desc : "",
          };
        }
      }
    } catch {
      // 降级到 Mock
    }
  }
  return seedLoops[0];
}
