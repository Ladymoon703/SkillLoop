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
