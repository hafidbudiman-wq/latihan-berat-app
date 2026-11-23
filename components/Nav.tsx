"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Beranda", icon: "🏠" },
  { href: "/program", label: "Program", icon: "📋" },
  { href: "/workout", label: "Workout", icon: "🏋️" },
  { href: "/latihan", label: "Latihan", icon: "📚" },
  { href: "/coach", label: "Coach", icon: "🤖" },
];

export default function Nav() {
  const path = usePathname();
  const active = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));
  return (
    <>
      <header className="sticky top-0 z-20 border-b border-line bg-bg/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link href="/" className="text-lg font-bold">
            <span className="text-accent">WT</span> Agent
          </Link>
          <nav className="hidden gap-1 sm:flex">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-lg px-3 py-1.5 text-sm ${active(l.href) ? "bg-accent/15 text-accent" : "text-muted hover:text-text"}`}
              >
                {l.label}
              </Link>
            ))}
            <Link href="/riwayat" className={`rounded-lg px-3 py-1.5 text-sm ${active("/riwayat") ? "bg-accent/15 text-accent" : "text-muted hover:text-text"}`}>
              Riwayat
            </Link>
          </nav>
        </div>
      </header>
      <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-5 border-t border-line bg-bg/95 pb-[env(safe-area-inset-bottom)] sm:hidden">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`flex flex-col items-center py-2 text-[11px] ${active(l.href) ? "text-accent" : "text-muted"}`}
          >
            <span className="text-lg leading-none">{l.icon}</span>
            {l.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
