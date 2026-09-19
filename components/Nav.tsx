"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { currentUserId, getUser } from "@/lib/data";

const links = [
  { href: "/", label: "首页" },
  { href: "/discovery", label: "发现技能" },
  { href: "/skills", label: "我的技能" },
  { href: "/match", label: "AI匹配" },
  { href: "/loop", label: "SkillLoop", badge: true },
  { href: "/exchanges", label: "我的交换" },
  { href: "/passport", label: "Passport" },
];

export default function Nav() {
  const pathname = usePathname();
  const me = getUser(currentUserId);

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#05050a]/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:gap-6">
        <Link href="/" className="flex shrink-0 items-center gap-2 text-lg font-bold">
          <span className="glow-ring inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white">
            ◈
          </span>
          <span className="text-gradient hidden sm:inline">SkillLoop</span>
        </Link>

        <nav className="flex flex-1 items-center gap-1 overflow-x-auto">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-sm transition-colors ${
                  active
                    ? "bg-white/10 font-medium text-white"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {l.label}
                {l.badge && (
                  <span className="rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                    NEW
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden shrink-0 items-center gap-2 rounded-full glass px-3 py-1.5 text-sm sm:flex">
          <span className="text-amber-300">●</span>
          <span className="font-semibold">{me.coin}</span>
          <span className="text-zinc-400">Coin</span>
        </div>
      </div>
    </header>
  );
}
