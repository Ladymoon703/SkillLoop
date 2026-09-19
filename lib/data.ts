export type Skill = {
  id: string;
  name: string;
  icon: string;
  color: string;
};

export type User = {
  id: string;
  name: string;
  handle: string;
  emoji: string;
  color: string;
  bio: string;
  online: boolean;
  times: string[];
  coin: number;
  stats: { teaching: number; hours: number; tasks: number; exchanges: number };
};

export type UserSkill = {
  userId: string;
  skillId: string;
  type: "teach" | "learn";
  level?: number;
  desc?: string;
  aiSummary?: string;
  directions?: string[];
  goal?: string;
};

export type Task = {
  id: string;
  exchangeId: string;
  title: string;
  by: string;
  for: string;
  status: "todo" | "doing" | "confirm" | "done";
  minutes: number;
  coin: number;
  due: string;
};

export type Exchange = {
  id: string;
  a: string;
  b: string;
  teachAB: string;
  teachBA: string;
  status: "active" | "done";
  goal: string;
  plan: { week: string; title: string; tasks: string[] }[];
  tasks: Task[];
};

export type Loop = {
  title: string;
  members: string[];
  edges: { from: string; to: string; skill: string }[];
  desc: string;
};

export type Tx = { id: string; amount: number; desc: string; time: string };
export type Badge = { name: string; icon: string; desc: string };

export const skills: Skill[] = [
  { id: "python", name: "Python", icon: "🐍", color: "#3b82f6" },
  { id: "coding", name: "编程", icon: "💻", color: "#6366f1" },
  { id: "excel", name: "Excel", icon: "📊", color: "#10b981" },
  { id: "aitools", name: "AI工具", icon: "🤖", color: "#8b5cf6" },
  { id: "photo", name: "摄影", icon: "📷", color: "#f59e0b" },
  { id: "video", name: "视频剪辑", icon: "🎬", color: "#ef4444" },
  { id: "ppt", name: "PPT", icon: "📽️", color: "#f97316" },
  { id: "ps", name: "PS", icon: "🎨", color: "#ec4899" },
  { id: "english", name: "英语", icon: "💬", color: "#06b6d4" },
  { id: "japanese", name: "日语", icon: "🇯🇵", color: "#eab308" },
  { id: "korean", name: "韩语", icon: "🇰🇷", color: "#22c55e" },
  { id: "guitar", name: "吉他", icon: "🎸", color: "#a855f7" },
  { id: "fitness", name: "健身", icon: "💪", color: "#f43f5e" },
  { id: "cooking", name: "做饭", icon: "🍳", color: "#fb923c" },
];

export const users: User[] = [
  { id: "alex", name: "Alex", handle: "@alex", emoji: "🦊", color: "#8b5cf6", bio: "后端工程师，喜欢把复杂的东西讲简单", online: true, times: ["周三晚", "周六上午"], coin: 120, stats: { teaching: 18, hours: 32, tasks: 24, exchanges: 9 } },
  { id: "mia", name: "Mia", handle: "@mia", emoji: "🐱", color: "#f59e0b", bio: "独立摄影师，旅行与人文纪实爱好者", online: true, times: ["周三晚", "周六上午"], coin: 260, stats: { teaching: 31, hours: 48, tasks: 37, exchanges: 14 } },
  { id: "ken", name: "Ken", handle: "@ken", emoji: "🐼", color: "#eab308", bio: "日语专业在读，动漫与 J-POP 发烧友", online: true, times: ["周二晚", "周日"], coin: 90, stats: { teaching: 12, hours: 21, tasks: 15, exchanges: 6 } },
  { id: "emma", name: "Emma", handle: "@emma", emoji: "🐰", color: "#06b6d4", bio: "英语老师，TESOL 认证", online: false, times: ["工作日白天"], coin: 340, stats: { teaching: 44, hours: 60, tasks: 50, exchanges: 20 } },
  { id: "leo", name: "Leo", handle: "@leo", emoji: "🦁", color: "#a855f7", bio: "乐队吉他手，玩了 8 年琴", online: true, times: ["周五晚", "周末"], coin: 75, stats: { teaching: 15, hours: 26, tasks: 18, exchanges: 7 } },
  { id: "sara", name: "Sara", handle: "@sara", emoji: "🦉", color: "#10b981", bio: "数据分析师，Excel 重度用户", online: false, times: ["周一晚", "周四晚"], coin: 210, stats: { teaching: 27, hours: 35, tasks: 30, exchanges: 11 } },
  { id: "noah", name: "Noah", handle: "@noah", emoji: "🐻", color: "#f43f5e", bio: "健身教练，也爱研究家常菜", online: true, times: ["每天早上", "周末"], coin: 150, stats: { teaching: 22, hours: 30, tasks: 25, exchanges: 10 } },
  { id: "lily", name: "Lily", handle: "@lily", emoji: "🦋", color: "#ef4444", bio: "短视频剪辑师，百万播放账号主理人", online: true, times: ["周三晚"], coin: 185, stats: { teaching: 19, hours: 28, tasks: 22, exchanges: 8 } },
  { id: "jack", name: "Jack", handle: "@jack", emoji: "🐺", color: "#6366f1", bio: "全栈开发，开源项目维护者", online: false, times: ["工作日晚上"], coin: 130, stats: { teaching: 24, hours: 38, tasks: 28, exchanges: 12 } },
  { id: "zoe", name: "Zoe", handle: "@zoe", emoji: "🐨", color: "#fb923c", bio: "美食博主，一锅好菜治愈一切", online: true, times: ["周末"], coin: 95, stats: { teaching: 11, hours: 18, tasks: 13, exchanges: 5 } },
];

export const userSkills: UserSkill[] = [
  // Alex（当前用户）
  { userId: "alex", skillId: "python", type: "teach", level: 4, desc: "Python 自动化与后端开发", aiSummary: "能系统讲解 Python 基础到爬虫、脚本自动化", directions: ["零基础入门", "自动化脚本", "Web 后端"] },
  { userId: "alex", skillId: "aitools", type: "teach", level: 3, desc: "ChatGPT / 提示词工程", aiSummary: "熟练使用主流 AI 工具提效，能教提示词技巧", directions: ["AI 提效", "提示词工程"] },
  { userId: "alex", skillId: "ppt", type: "teach", level: 3, desc: "职场汇报 PPT", aiSummary: "擅长结构化表达与简洁排版", directions: ["职场汇报", "逻辑排版"] },
  { userId: "alex", skillId: "photo", type: "learn", goal: "30天学会旅行摄影" },
  { userId: "alex", skillId: "japanese", type: "learn", goal: "日常会话入门" },
  { userId: "alex", skillId: "guitar", type: "learn", goal: "弹唱 3 首歌" },
  // Mia
  { userId: "mia", skillId: "photo", type: "teach", level: 4, desc: "人像与旅行摄影", aiSummary: "擅长构图与光线，作品多次入选摄影展", directions: ["旅行摄影", "人像", "手机摄影"] },
  { userId: "mia", skillId: "video", type: "teach", level: 3, desc: "旅行 Vlog 剪辑", aiSummary: "能把素材剪出故事感", directions: ["Vlog", "节奏把控"] },
  { userId: "mia", skillId: "japanese", type: "learn", goal: "去日本自由行无障碍" },
  { userId: "mia", skillId: "python", type: "learn", goal: "自动化整理照片" },
  // Ken
  { userId: "ken", skillId: "japanese", type: "teach", level: 4, desc: "日语听说读写", aiSummary: "N1 高分，发音地道，能教从五十音到会话", directions: ["五十音", "日常会话", "JLPT 备考"] },
  { userId: "ken", skillId: "korean", type: "teach", level: 2, desc: "韩语基础", aiSummary: "会基础韩语，可带入门", directions: ["基础发音"] },
  { userId: "ken", skillId: "python", type: "learn", goal: "写爬虫抓动漫资源" },
  { userId: "ken", skillId: "photo", type: "learn", goal: "漫展拍照" },
  // Emma
  { userId: "emma", skillId: "english", type: "teach", level: 5, desc: "英语口语与写作", aiSummary: "TESOL 认证教师，全英教学", directions: ["口语", "商务英语", "雅思"] },
  { userId: "emma", skillId: "ppt", type: "teach", level: 3, desc: "教学课件", aiSummary: "课件排版清晰", directions: ["课件设计"] },
  { userId: "emma", skillId: "guitar", type: "learn", goal: "年会表演" },
  { userId: "emma", skillId: "cooking", type: "learn", goal: "学做 5 道家常菜" },
  // Leo
  { userId: "leo", skillId: "guitar", type: "teach", level: 4, desc: "吉他弹唱与指弹", aiSummary: "8 年琴龄，能教和弦、节奏与即兴", directions: ["弹唱", "指弹入门", "乐理"] },
  { userId: "leo", skillId: "python", type: "learn", goal: "做个小工具" },
  { userId: "leo", skillId: "english", type: "learn", goal: "看懂英文乐谱资料" },
  // Sara
  { userId: "sara", skillId: "excel", type: "teach", level: 5, desc: "Excel 数据分析", aiSummary: "精通函数、透视表与可视化", directions: ["函数", "透视表", "数据看板"] },
  { userId: "sara", skillId: "ps", type: "teach", level: 3, desc: "海报设计", aiSummary: "能做活动海报", directions: ["海报", "修图"] },
  { userId: "sara", skillId: "photo", type: "learn", goal: "旅行拍照更好看" },
  { userId: "sara", skillId: "aitools", type: "learn", goal: "用 AI 提升工作效率" },
  // Noah
  { userId: "noah", skillId: "fitness", type: "teach", level: 4, desc: "增肌减脂训练", aiSummary: "持证教练，能制定训练计划", directions: ["增肌", "减脂", "体态纠正"] },
  { userId: "noah", skillId: "cooking", type: "teach", level: 3, desc: "家常菜", aiSummary: "健康快手菜专家", directions: ["快手菜", "减脂餐"] },
  { userId: "noah", skillId: "japanese", type: "learn", goal: "看懂健身日文资料" },
  { userId: "noah", skillId: "excel", type: "learn", goal: "记录训练数据" },
  // Lily
  { userId: "lily", skillId: "video", type: "teach", level: 4, desc: "短视频剪辑", aiSummary: "百万播放账号主理人，懂流量节奏", directions: ["剪映", "节奏", "涨粉"] },
  { userId: "lily", skillId: "photo", type: "teach", level: 2, desc: "手机摄影", aiSummary: "手机也能出大片", directions: ["手机摄影"] },
  { userId: "lily", skillId: "english", type: "learn", goal: "看懂剪辑教程" },
  { userId: "lily", skillId: "ppt", type: "learn", goal: "做作品集" },
  // Jack
  { userId: "jack", skillId: "coding", type: "teach", level: 4, desc: "全栈开发", aiSummary: "前端到后端都能带", directions: ["前端", "后端", "部署"] },
  { userId: "jack", skillId: "python", type: "teach", level: 3, desc: "Python 进阶", aiSummary: "能做工程化 Python 项目", directions: ["工程化", "Web"] },
  { userId: "jack", skillId: "fitness", type: "learn", goal: "久坐族拉伸" },
  { userId: "jack", skillId: "photo", type: "learn", goal: "生活记录" },
  // Zoe
  { userId: "zoe", skillId: "cooking", type: "teach", level: 4, desc: "家常菜与烘焙", aiSummary: "美食博主，一学就会的菜谱", directions: ["家常菜", "烘焙", "摆盘"] },
  { userId: "zoe", skillId: "ps", type: "teach", level: 3, desc: "美食修图", aiSummary: "让食物看起来更好吃", directions: ["美食修图"] },
  { userId: "zoe", skillId: "korean", type: "learn", goal: "追剧不用字幕" },
  { userId: "zoe", skillId: "english", type: "learn", goal: "旅行英语" },
];

export const currentUserId = "alex";

export const exchange: Exchange = {
  id: "alex-mia",
  a: "alex",
  b: "mia",
  teachAB: "Python",
  teachBA: "摄影",
  status: "active",
  goal: "30天学会旅行摄影 · 同时帮 Mia 入门 Python 自动化",
  plan: [
    { week: "Week 1", title: "构图基础", tasks: ["三分法 / 引导线", "20分钟摄影实操", "20分钟 Python 环境搭建"] },
    { week: "Week 2", title: "光线运用", tasks: ["自然光与黄金时刻", "逆光人像", "Python 变量与循环"] },
    { week: "Week 3", title: "人物拍摄", tasks: ["人像摆姿与沟通", "街拍抓拍", "Python 函数与文件处理"] },
    { week: "Week 4", title: "旅行实战", tasks: ["一次完整的旅行拍摄", "修图调色", "Python 写一个照片整理脚本"] },
  ],
  tasks: [
    { id: "t1", exchangeId: "alex-mia", title: "20分钟摄影教学：构图基础", by: "mia", for: "alex", status: "confirm", minutes: 20, coin: 20, due: "今天" },
    { id: "t2", exchangeId: "alex-mia", title: "20分钟 Python 教学：环境搭建", by: "alex", for: "mia", status: "doing", minutes: 20, coin: 20, due: "明天" },
    { id: "t3", exchangeId: "alex-mia", title: "摄影作业：用三分法拍 3 张照片", by: "mia", for: "alex", status: "todo", minutes: 30, coin: 30, due: "本周六" },
    { id: "t4", exchangeId: "alex-mia", title: "Python 作业：写一个文件重命名脚本", by: "alex", for: "mia", status: "todo", minutes: 30, coin: 30, due: "本周六" },
  ],
};

export const loops: Loop[] = [
  {
    title: "AI 发现一个 3 人技能交换闭环",
    members: ["alex", "ken", "mia"],
    edges: [
      { from: "alex", to: "ken", skill: "Python" },
      { from: "ken", to: "mia", skill: "日语" },
      { from: "mia", to: "alex", skill: "摄影" },
    ],
    desc: "Alex 教 Ken Python，Ken 教 Mia 日语，Mia 教 Alex 摄影 —— 三个人各取所需，形成一个无需货币的完整交换闭环。",
  },
];

export const txs: Tx[] = [
  { id: "tx1", amount: 30, desc: "完成 Python 教学（教 Mia）", time: "今天 10:20" },
  { id: "tx2", amount: -30, desc: "学习摄影（Mia 授课）", time: "今天 11:00" },
  { id: "tx3", amount: 20, desc: "完成 PPT 教学（教 Emma）", time: "昨天" },
  { id: "tx4", amount: 40, desc: "完成 Python 教学（教 Ken）", time: "3 天前" },
  { id: "tx5", amount: -20, desc: "学习日语（Ken 授课）", time: "5 天前" },
];

export const badges: Badge[] = [
  { name: "Python Mentor", icon: "🐍", desc: "累计完成 10 次 Python 教学" },
  { name: "Photography Learner", icon: "📷", desc: "摄影学习时长超过 10 小时" },
  { name: "Quick Starter", icon: "⚡", desc: "24 小时内完成首次交换" },
];

export type Match = {
  userId: string;
  reasons: string[];
  score: number;
  timeMatch: string;
};

export const matches: Match[] = [
  {
    userId: "mia",
    score: 96,
    timeMatch: "周三晚 · 线上",
    reasons: [
      "你可以教 Python，Mia 正在学 Python（想写照片整理脚本）",
      "Mia 擅长摄影（Lv.4），而你正在学摄影",
      "双方都偏好线上教学，周三晚上都有空",
    ],
  },
  {
    userId: "ken",
    score: 92,
    timeMatch: "周日 · 线上",
    reasons: [
      "你可以教 Python，Ken 正在学 Python（想写爬虫）",
      "Ken 擅长日语（Lv.4），而你正在学日语",
      "Ken 也是摄影爱好者，还能一起交流",
    ],
  },
  {
    userId: "leo",
    score: 85,
    timeMatch: "周五晚 · 线下",
    reasons: [
      "Leo 擅长吉他（Lv.4），而你正在学吉他",
      "Leo 想学 Python，你可以反向教学",
      "Leo 偏好线下，你家附近有琴行",
    ],
  },
];

export function getUser(id: string): User {
  return users.find((u) => u.id === id)!;
}

export function getSkill(id: string): Skill {
  return skills.find((s) => s.id === id)!;
}

export function teachSkills(userId: string): UserSkill[] {
  return userSkills.filter((s) => s.userId === userId && s.type === "teach");
}

export function learnSkills(userId: string): UserSkill[] {
  return userSkills.filter((s) => s.userId === userId && s.type === "learn");
}
