"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { LoggedExercise, SetEntry } from "@/lib/types";
import { newId, useActiveSession, useSessions } from "@/lib/storage";
import { estimate1RM, sessionVolume, suggestNext } from "@/lib/progression";
import { buildLoggedExercise } from "@/lib/session";
import { muscleLabel } from "@/lib/muscles";
import ExercisePicker from "@/components/ExercisePicker";
import BodyMap from "@/components/BodyMap";

const REST_SEC = 90;

export default function WorkoutPage() {
  const router = useRouter();
  const [active, setActive, loaded] = useActiveSession();
  const [sessions, setSessions] = useSessions();
  const [picking, setPicking] = useState(false);
  const [restUntil, setRestUntil] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!restUntil) return;
    const t = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(t);
  }, [restUntil]);

  if (!loaded) return <p className="text-muted">Memuat…</p>;

  if (!active) {
    return (
      <div className="card space-y-3 text-center">
        <h1 className="text-xl font-bold">Belum ada sesi aktif</h1>
        <p className="text-sm text-muted">Mulai dari program, atau buat sesi bebas dan tambahkan latihan sendiri.</p>
        <div className="flex justify-center gap-2">
          <Link href="/program" className="btn-primary">Pilih program</Link>
          <button
            className="btn-ghost"
            onClick={() => setActive({ id: newId(), date: new Date().toISOString(), title: "Sesi bebas", exercises: [] })}
          >
            Sesi bebas
          </button>
        </div>
      </div>
    );
  }

  const update = (i: number, fn: (e: LoggedExercise) => LoggedExercise) =>
    setActive({ ...active, exercises: active.exercises.map((e, j) => (j === i ? fn(e) : e)) });
  const updateSet = (i: number, k: number, patch: Partial<SetEntry>) =>
    update(i, (e) => ({ ...e, sets: e.sets.map((s, j) => (j === k ? { ...s, ...patch } : s)) }));

  const totalSets = active.exercises.reduce((a, e) => a + e.sets.length, 0);
  const doneSets = active.exercises.reduce((a, e) => a + e.sets.filter((s) => s.done).length, 0);
  const restLeft = restUntil ? Math.max(0, Math.ceil((restUntil - now) / 1000)) : 0;

  const finish = () => {
    const cleaned = {
      ...active,
      exercises: active.exercises.filter((e) => e.sets.some((s) => s.done)),
    };
    if (!cleaned.exercises.length) {
      if (window.confirm("Belum ada set yang dicentang. Buang sesi ini?")) setActive(null);
      return;
    }
    setSessions([...sessions, cleaned]);
    setActive(null);
    router.push("/riwayat");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <input
            value={active.title}
            onChange={(e) => setActive({ ...active, title: e.target.value })}
            className="w-full bg-transparent text-xl font-bold focus:outline-none"
            aria-label="Judul sesi"
          />
          <p className="text-sm text-muted">
            {doneSets}/{totalSets} set selesai · volume {Math.round(sessionVolume(active))} kg
          </p>
        </div>
        <div className="flex gap-2">
          <button className="btn-ghost text-sm" onClick={() => window.confirm("Batalkan sesi ini?") && setActive(null)}>
            Batal
          </button>
          <button className="btn-primary text-sm" onClick={finish}>Selesai</button>
        </div>
      </div>

      {restLeft > 0 && (
        <div className="card sticky top-16 z-10 flex items-center justify-between border-accent">
          <span>Istirahat: <b className="text-accent">{restLeft} dtk</b></span>
          <button className="btn-ghost text-sm" onClick={() => setRestUntil(null)}>Lewati</button>
        </div>
      )}

      {active.exercises.map((e, i) => {
        const tip = suggestNext(e.exerciseId, e.targetReps, e.primaryMuscles, sessions);
        const best = Math.max(0, ...e.sets.filter((s) => s.done).map((s) => estimate1RM(s.weight, s.reps)));
        return (
          <section key={`${e.exerciseId}-${i}`} className="card space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <Link href={`/latihan/${e.exerciseId}`} className="font-semibold hover:text-accent">{e.name}</Link>
                <p className="text-xs text-muted">{e.primaryMuscles.map(muscleLabel).join(", ")} · target {e.targetReps} reps</p>
              </div>
              <button
                className="text-xs text-danger"
                onClick={() => setActive({ ...active, exercises: active.exercises.filter((_, j) => j !== i) })}
              >
                Hapus
              </button>
            </div>
            <p className={`rounded-lg px-3 py-2 text-xs ${tip.action === "naik" ? "bg-accent/10 text-accent" : tip.action === "turun" ? "bg-warn/10 text-warn" : "bg-white/5 text-muted"}`}>
              🤖 {tip.reason}
            </p>
            <table className="w-full text-sm">
              <thead className="text-xs text-muted">
                <tr>
                  <th className="w-10 text-left">Set</th>
                  <th className="text-left">Beban (kg)</th>
                  <th className="text-left">Reps</th>
                  <th className="w-12 text-center">✓</th>
                </tr>
              </thead>
              <tbody>
                {e.sets.map((s, k) => (
                  <tr key={k} className={s.done ? "text-accent" : ""}>
                    <td className="py-1">{k + 1}</td>
                    <td className="py-1 pr-2">
                      <input type="number" inputMode="decimal" min={0} step={0.5} value={s.weight}
                        onChange={(ev) => updateSet(i, k, { weight: Number(ev.target.value) })}
                        className="input py-1" aria-label={`Beban set ${k + 1}`} />
                    </td>
                    <td className="py-1 pr-2">
                      <input type="number" inputMode="numeric" min={0} value={s.reps}
                        onChange={(ev) => updateSet(i, k, { reps: Number(ev.target.value) })}
                        className="input py-1" aria-label={`Repetisi set ${k + 1}`} />
                    </td>
                    <td className="text-center">
                      <input type="checkbox" checked={s.done} className="h-5 w-5 accent-[var(--accent)]"
                        aria-label={`Set ${k + 1} selesai`}
                        onChange={(ev) => {
                          updateSet(i, k, { done: ev.target.checked });
                          if (ev.target.checked) {
                            setNow(Date.now());
                            setRestUntil(Date.now() + REST_SEC * 1000);
                          }
                        }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex items-center justify-between text-xs">
              <div className="flex gap-3">
                <button className="text-accent" onClick={() => update(i, (x) => ({ ...x, sets: [...x.sets, { ...(x.sets.at(-1) ?? { reps: x.targetReps, weight: 0 }), done: false }] }))}>
                  + Set
                </button>
                {e.sets.length > 1 && (
                  <button className="text-muted" onClick={() => update(i, (x) => ({ ...x, sets: x.sets.slice(0, -1) }))}>
                    − Set
                  </button>
                )}
              </div>
              {best > 0 && <span className="text-muted">Estimasi 1RM: {best} kg</span>}
            </div>
          </section>
        );
      })}

      <button className="btn-ghost w-full" onClick={() => setPicking(true)}>+ Tambah latihan</button>

      {active.exercises.length > 0 && (
        <div className="card">
          <h2 className="mb-2 font-semibold">Otot yang dilatih sesi ini</h2>
          <BodyMap
            primary={active.exercises.flatMap((e) => e.primaryMuscles)}
            secondary={active.exercises.flatMap((e) => e.secondaryMuscles)}
            size={130}
          />
        </div>
      )}

      {picking && (
        <ExercisePicker
          onClose={() => setPicking(false)}
          onPick={(ex) => {
            const tip = suggestNext(ex.id, 10, ex.primaryMuscles, sessions);
            setActive({ ...active, exercises: [...active.exercises, buildLoggedExercise(ex, 3, 10, tip.weight)] });
            setPicking(false);
          }}
        />
      )}
    </div>
  );
}
