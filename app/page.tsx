"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useActiveSession, useProfile, useSessions } from "@/lib/storage";
import { sessionVolume, weeklySetsByMuscle } from "@/lib/progression";
import { WEEKLY_SET_TARGET } from "@/lib/coach";
import { muscleLabel } from "@/lib/muscles";
import BodyMap from "@/components/BodyMap";
import CountUp from "@/components/CountUp";
import Ring from "@/components/Ring";

const MAJOR = ["chest", "lats", "middle back", "shoulders", "quadriceps", "hamstrings", "glutes", "biceps", "triceps", "abdominals"];
const DAYS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

function greeting(h: number) {
  if (h < 11) return "Selamat pagi";
  if (h < 15) return "Selamat siang";
  if (h < 18) return "Selamat sore";
  return "Selamat malam";
}

/** Indeks hari (Senin=0) yang ada latihannya di minggu kalender ini. */
function activeDaysThisWeek(dates: string[], now: Date) {
  const monday = new Date(now);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  const set = new Set<number>();
  for (const s of dates) {
    const t = new Date(s);
    const diff = Math.floor((t.getTime() - monday.getTime()) / 864e5);
    if (diff >= 0 && diff < 7) set.add(diff);
  }
  return set;
}

export default function Home() {
  const [sessions, , loaded] = useSessions();
  const [active] = useActiveSession();
  const [profile] = useProfile();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const now = new Date();
  const weekly = weeklySetsByMuscle(sessions);
  const weekSessions = sessions.filter((s) => Date.now() - new Date(s.date).getTime() < 7 * 864e5);
  const weekVolume = weekSessions.reduce((a, s) => a + sessionVolume(s), 0);
  const target = profile.daysPerWeek ?? 3;
  const days = activeDaysThisWeek(sessions.map((s) => s.date), now);
  const today = (now.getDay() + 6) % 7;
  const done = days.size;

  return (
    <div className="space-y-4">
      <section className="hero-gradient animate-in relative overflow-hidden rounded-3xl border border-line/60 p-5">
        <div className="pointer-events-none absolute -right-6 -top-6 text-[110px] opacity-20 animate-float">🏋️</div>
        <p className="text-sm text-muted">{mounted ? greeting(now.getHours()) : "Halo"} 👋</p>
        <h1 className="mt-1 text-3xl font-extrabold leading-tight tracking-tight">
          {done >= target ? (
            <>Target minggu ini <span className="text-gradient">tercapai!</span></>
          ) : (
            <>Ayo <span className="text-gradient">gas latihan</span> hari ini</>
          )}
        </h1>
        <p className="mt-1 max-w-md text-sm text-muted">
          Pilih program, catat tiap set, dan biarkan agent naikkan beban kamu pelan-pelan tapi pasti.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {active ? (
            <Link href="/workout" className="btn-primary">▶ Lanjutkan: {active.title}</Link>
          ) : (
            <Link href="/program" className="btn-primary">▶ Mulai latihan</Link>
          )}
          <Link href="/coach" className="btn-ghost">🤖 Tanya Coach</Link>
        </div>
      </section>

      <section className="card animate-in flex items-center gap-4" style={d(80)}>
        <Ring value={loaded ? done : 0} max={target} size={92}>
          <div>
            <p className="text-xl font-extrabold">{done}/{target}</p>
            <p className="text-[10px] text-muted">hari</p>
          </div>
        </Ring>
        <div className="flex-1">
          <p className="font-semibold">Minggu ini</p>
          <p className="mb-2 text-xs text-muted">Target {target} hari latihan</p>
          <div className="flex gap-1.5">
            {DAYS.map((name, i) => (
              <div key={name} className="flex flex-1 flex-col items-center gap-1">
                <span
                  className={`grid h-7 w-full max-w-8 place-items-center rounded-lg text-xs transition duration-500 ${
                    days.has(i)
                      ? "animate-pop-in bg-gradient-to-br from-accent to-accent2 text-bg"
                      : i === today
                        ? "border border-accent/60 text-accent"
                        : "bg-white/5 text-muted"
                  }`}
                  style={d(i * 50)}
                >
                  {days.has(i) ? "✓" : ""}
                </span>
                <span className={`text-[10px] ${i === today ? "text-accent" : "text-muted"}`}>{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-3 gap-3">
        <Stat delay={140} label="Sesi 7 hari" value={loaded ? weekSessions.length : 0} />
        <Stat delay={190} label="Volume 7 hari" value={loaded ? weekVolume : 0} unit="kg" />
        <Stat delay={240} label="Total sesi" value={loaded ? sessions.length : 0} />
      </div>

      <section className="card animate-in grid gap-4 md:grid-cols-2" style={d(300)}>
        <div>
          <h2 className="font-semibold">Peta otot minggu ini</h2>
          <p className="mb-3 text-xs text-muted">
            Makin terang = makin banyak set. Kuning = zona ideal {WEEKLY_SET_TARGET.min}-{WEEKLY_SET_TARGET.max} set.
          </p>
          <BodyMap heat={weekly} size={140} />
        </div>
        <div>
          <h2 className="mb-2 font-semibold">Set per otot (7 hari)</h2>
          <ul className="space-y-2 text-sm">
            {MAJOR.map((m, i) => {
              const n = weekly[m] ?? 0;
              const pct = Math.min(100, (n / WEEKLY_SET_TARGET.max) * 100);
              const color =
                n > WEEKLY_SET_TARGET.max ? "from-hot to-danger" : n >= WEEKLY_SET_TARGET.min ? "from-warn to-hot" : "from-accent to-accent2";
              return (
                <li key={m}>
                  <div className="flex justify-between text-xs">
                    <span>{muscleLabel(m)}</span>
                    <span className="text-muted">{n} set</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/5">
                    <div
                      className={`h-2 rounded-full bg-gradient-to-r ${color}`}
                      style={{ width: mounted ? `${pct}%` : 0, transition: `width .9s cubic-bezier(.2,.7,.2,1) ${i * 60}ms` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value, unit, delay }: { label: string; value: number; unit?: string; delay: number }) {
  return (
    <div className="card card-hover animate-pop-in p-3 text-center" style={d(delay)}>
      <p className="text-lg font-extrabold">
        <CountUp value={value} format={(n) => Math.round(n).toLocaleString("id-ID")} />
        {unit && <span className="ml-0.5 text-xs font-normal text-muted">{unit}</span>}
      </p>
      <p className="text-[11px] text-muted">{label}</p>
    </div>
  );
}
