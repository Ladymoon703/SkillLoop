"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { getUser } from "@/lib/data";
import { Avatar } from "@/components/ui";

export default function ExchangesPage() {
  const { exchanges } = useStore();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-bold">我的交换</h1>
      <p className="mt-1 text-zinc-400">进行中的技能交换</p>

      <div className="mt-6 space-y-4">
        {exchanges.map((e) => {
          const a = getUser(e.a);
          const b = getUser(e.b);
          return (
            <Link
              key={e.id}
              href={`/exchanges/${e.id}`}
              className="glass glass-hover block rounded-3xl p-6"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-300">
                  进行中
                </span>
                <span className="text-sm text-zinc-500">
                  目标：{e.goal.slice(0, 18)}…
                </span>
              </div>
              <div className="mt-4 flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <Avatar user={a} size={48} />
                  <div>
                    <div className="font-semibold">{a.name}</div>
                    <div className="text-xs text-zinc-500">教 {e.teachAB}</div>
                  </div>
                </div>
                <div className="text-2xl text-violet-300">⇄</div>
                <div className="flex items-center gap-3">
                  <Avatar user={b} size={48} />
                  <div>
                    <div className="font-semibold">{b.name}</div>
                    <div className="text-xs text-zinc-500">教 {e.teachBA}</div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}

        {/* 历史交换 */}
        <div className="glass rounded-3xl p-6 opacity-60">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-zinc-500/15 px-3 py-1 text-xs font-medium text-zinc-400">
              已完成
            </span>
            <span className="text-sm text-zinc-500">教 Ken Python</span>
          </div>
          <div className="mt-4 flex items-center gap-6">
            <div className="flex items-center gap-3">
              <Avatar user={getUser("alex")} size={48} />
              <div>
                <div className="font-semibold">Alex</div>
                <div className="text-xs text-zinc-500">教 Python</div>
              </div>
            </div>
            <div className="text-2xl text-zinc-600">⇄</div>
            <div className="flex items-center gap-3">
              <Avatar user={getUser("ken")} size={48} />
              <div>
                <div className="font-semibold">Ken</div>
                <div className="text-xs text-zinc-500">教 日语</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
