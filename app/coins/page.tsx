import { getUser, currentUserId, txs } from "@/lib/data";

export default function CoinsPage() {
  const me = getUser(currentUserId);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      {/* 余额 */}
      <div className="glass glow-ring rounded-3xl p-8 text-center">
        <div className="text-sm text-zinc-400">我的 Skill Coin</div>
        <div className="mt-2 flex items-center justify-center gap-3">
          <span className="text-4xl text-amber-300">●</span>
          <span className="text-gradient text-6xl font-bold">{me.coin}</span>
        </div>
        <p className="mt-3 text-sm text-zinc-500">虚拟积分，不涉及真实货币</p>
      </div>

      {/* 规则 */}
      <div className="glass mt-6 rounded-3xl p-6">
        <h2 className="font-bold">积分规则</h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            ["🎓", "教学 30 分钟", "+30 Coin", "text-emerald-300"],
            ["📖", "学习 30 分钟", "-30 Coin", "text-rose-300"],
            ["🤝", "双方确认后", "才结算", "text-violet-300"],
          ].map(([icon, label, value, cls]) => (
            <div key={label} className="rounded-2xl bg-white/[0.03] p-4 text-center">
              <div className="text-2xl">{icon}</div>
              <div className="mt-1 text-sm font-semibold text-zinc-200">{label}</div>
              <div className={`font-bold ${cls}`}>{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 流水 */}
      <div className="glass mt-6 rounded-3xl p-6">
        <h2 className="font-bold">积分流水</h2>
        <ul className="mt-4 space-y-2">
          {txs.map((t) => (
            <li
              key={t.id}
              className="flex items-center gap-3 rounded-2xl bg-white/[0.03] px-4 py-3"
            >
              <span
                className={`w-14 text-lg font-bold ${
                  t.amount > 0 ? "text-emerald-300" : "text-rose-300"
                }`}
              >
                {t.amount > 0 ? "+" : ""}
                {t.amount}
              </span>
              <span className="flex-1 text-sm text-zinc-300">{t.desc}</span>
              <span className="shrink-0 text-xs text-zinc-500">{t.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
