"use client";
import Link from "next/link";
import { useActiveSession, useSessions } from "@/lib/storage";
import { sessionVolume, weeklySetsByMuscle } from "@/lib/progression";
import { WEEKLY_SET_TARGET } from "@/lib/coach";
import { muscleLabel } from "@/lib/muscles";
import BodyMap from "@/components/BodyMap";

const MAJOR = ["chest", "lats", "middle back", "shoulders", "quadriceps", "hamstrings", "glutes", "biceps", "triceps", "abdominals"];

export default function Home() {
  const [sessions, , loaded] = useSessions();
  const [active] = useActiveSession();
  const weekly = weeklySetsByMuscle(sessions);
  const weekSessions = sessions.filter((s) => Date.now() - new Date(s.date).getTime() < 7 * 864e5);
  const weekVolume = weekSessions.reduce((a, s) => a + sessionVolume(s), 0);

  return (
    <div className="space-y-4">
      <section className="card space-y-2">
        <h1 className="text-2xl font-bold">Halo! Siap latihan hari ini? 💪</h1>
        <p className="text-sm text-muted">
          Weight Training Agent bantu kamu pilih program, catat set, naikkan beban secara bertahap, dan lihat otot mana yang sudah/kurang dilatih.
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          {active ? (
            <Link href="/workout" className="btn-primary">Lanjutkan sesi: {active.title}</Link>
          ) : (
            <Link href="/program" className="btn-primary">Mulai latihan</Link>
          )}
          <Link href="/coach" className="btn-ghost">Tanya AI Coach</Link>
        </div>
      </section>

      <div className="grid grid-cols-3 gap-3">
        <Stat label="Sesi 7 hari" value={loaded ? String(weekSessions.length) : "–"} />
        <Stat label="Volume 7 hari" value={loaded ? `${Math.round(weekVolume).toLocaleString("id-ID")} kg` : "–"} />
        <Stat label="Total sesi" value={loaded ? String(sessions.length) : "–"} />
      </div>

      <section className="card grid gap-4 md:grid-cols-2">
        <div>
          <h2 className="font-semibold">Peta otot minggu ini</h2>
          <p className="mb-3 text-xs text-muted">
            Warna makin terang = makin banyak set. Kuning = zona ideal {WEEKLY_SET_TARGET.min}-{WEEKLY_SET_TARGET.max} set.
          </p>
          <BodyMap heat={weekly} size={140} />
        </div>
        <div>
          <h2 className="mb-2 font-semibold">Set per otot (7 hari)</h2>
          <ul className="space-y-1.5 text-sm">
            {MAJOR.map((m) => {
              const n = weekly[m] ?? 0;
              const pct = Math.min(100, (n / WEEKLY_SET_TARGET.max) * 100);
              const color = n >= WEEKLY_SET_TARGET.min ? (n > WEEKLY_SET_TARGET.max ? "bg-danger" : "bg-warn") : "bg-accent";
              return (
                <li key={m}>
                  <div className="flex justify-between text-xs"><span>{muscleLabel(m)}</span><span className="text-muted">{n} set</span></div>
                  <div className="h-1.5 rounded bg-white/5"><div className={`h-1.5 rounded ${color}`} style={{ width: `${pct}%` }} /></div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-3 text-center">
      <p className="text-lg font-bold">{value}</p>
      <p className="text-[11px] text-muted">{label}</p>
    </div>
  );
}
