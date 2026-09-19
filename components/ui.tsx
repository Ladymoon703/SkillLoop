import type { User } from "@/lib/data";

export function Avatar({ user, size = 40 }: { user: User; size?: number }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full font-bold text-white"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${user.color}, ${user.color}66)`,
        fontSize: size * 0.45,
      }}
    >
      {user.emoji}
    </div>
  );
}

export function LevelDots({ level }: { level: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={`h-1.5 w-1.5 rounded-full ${
            n <= level ? "bg-gradient-to-r from-violet-400 to-fuchsia-400" : "bg-white/15"
          }`}
        />
      ))}
      <span className="ml-1 text-xs text-zinc-400">Lv.{level}</span>
    </span>
  );
}

export function LevelBar({ level }: { level: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-1.5 flex-1 gap-0.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <div
            key={n}
            className={`flex-1 rounded-full ${
              n <= level ? "bg-gradient-to-r from-violet-500 to-fuchsia-400" : "bg-white/10"
            }`}
          />
        ))}
      </div>
      <span className="text-xs font-semibold text-zinc-300">Lv.{level}</span>
    </div>
  );
}

export function SkillTag({
  icon,
  name,
  color,
}: {
  icon: string;
  name: string;
  color: string;
}) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm text-white"
      style={{ background: `${color}1f`, border: `1px solid ${color}44` }}
    >
      <span>{icon}</span>
      {name}
    </span>
  );
}
