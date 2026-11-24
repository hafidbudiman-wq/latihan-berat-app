"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useActiveSession } from "@/lib/storage";

const LINKS = [
  { href: "/", label: "Beranda", icon: "🏠" },
  { href: "/program", label: "Program", icon: "📋" },
  { href: "/workout", label: "Workout", icon: "🏋️", main: true },
  { href: "/latihan", label: "Latihan", icon: "📚" },
  { href: "/coach", label: "Coach", icon: "🤖" },
];

export default function Nav() {
  const path = usePathname();
  const [active] = useActiveSession();
  const isActive = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));
  return (
    <>
      <header className="sticky top-0 z-20 border-b border-line/60 bg-bg/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2 text-lg font-extrabold tracking-tight">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-accent to-accent2 text-base shadow-[0_6px_20px_-6px_#4be3d6]">💪</span>
            <span>
              <span className="text-gradient">WT</span> Agent
            </span>
          </Link>
          <nav className="hidden gap-1 sm:flex">
            {[...LINKS, { href: "/riwayat", label: "Riwayat", icon: "" }].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`relative rounded-lg px-3 py-1.5 text-sm transition ${isActive(l.href) ? "bg-accent/15 text-accent" : "text-muted hover:bg-white/5 hover:text-text"}`}
              >
                {l.label}
                {l.href === "/workout" && active && <span className="absolute right-1 top-1 h-2 w-2 animate-pulse rounded-full bg-hot" />}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-line/60 bg-bg/80 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl sm:hidden">
        <div className="grid grid-cols-5 items-end">
          {LINKS.map((l) =>
            l.main ? (
              <Link key={l.href} href={l.href} className="-mt-5 flex flex-col items-center pb-2 text-[11px]">
                <span
                  className={`relative grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-accent to-accent2 text-2xl shadow-[0_10px_30px_-8px_#4be3d6] transition active:scale-90 ${isActive(l.href) ? "ring-2 ring-white/70" : ""}`}
                >
                  {l.icon}
                  {active && <span className="absolute -right-1 -top-1 h-3.5 w-3.5 animate-pulse rounded-full border-2 border-bg bg-hot" />}
                </span>
                <span className={isActive(l.href) ? "mt-1 text-accent" : "mt-1 text-muted"}>{l.label}</span>
              </Link>
            ) : (
              <Link
                key={l.href}
                href={l.href}
                className={`flex flex-col items-center py-2 text-[11px] transition active:scale-90 ${isActive(l.href) ? "text-accent" : "text-muted"}`}
              >
                <span className={`text-lg leading-none transition ${isActive(l.href) ? "-translate-y-0.5 scale-110" : ""}`}>{l.icon}</span>
                {l.label}
                <span className={`mt-1 h-1 w-1 rounded-full bg-accent transition ${isActive(l.href) ? "opacity-100" : "opacity-0"}`} />
              </Link>
            ),
          )}
        </div>
      </nav>
    </>
  );
}
