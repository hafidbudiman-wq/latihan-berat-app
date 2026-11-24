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
import MotionDemo from "@/components/MotionDemo";
import Ring from "@/components/Ring";
import Celebration from "@/components/Celebration";
import { useExerciseIndex } from "@/lib/exerciseIndex";

const REST_SEC = 90;

export default function WorkoutPage() {
  const router = useRouter();
  const [active, setActive, loaded] = useActiveSession();
  const [sessions, setSessions] = useSessions();
  const [picking, setPicking] = useState(false);
  const [restUntil, setRestUntil] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());
  const [restTotal, setRestTotal] = useState(REST_SEC);
  const [celebrate, setCelebrate] = useState(false);
  const [popKey, setPopKey] = useState("");
  const { items: index } = useExerciseIndex();
  const framesOf = (id: string) => index?.find((x) => x.id === id)?.frames ?? [];

  useEffect(() => {
    if (!restUntil) return;
    const t = setInterval(() => {
      const n = Date.now();
      setNow(n);
      if (n >= restUntil) {
        clearInterval(t);
        setRestUntil(null);
        try {
          navigator.vibrate?.([200, 100, 200]);
        } catch {}
      }
    }, 250);
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
  const pct = totalSets ? Math.round((doneSets / totalSets) * 100) : 0;

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
    setCelebrate(true);
    setTimeout(() => {
      setActive(null);
      router.push("/riwayat");
    }, 1800);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="min-w-0">
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
          <button className="btn-ghost flex-1 text-sm" onClick={() => window.confirm("Batalkan sesi ini?") && setActive(null)}>
            Batal
          </button>
          <button className="btn-primary flex-[2] text-sm" onClick={finish}>✓ Selesai</button>
        </div>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-white/5">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-accent via-accent2 to-hot"
          style={{ width: `${pct}%`, transition: "width .6s cubic-bezier(.2,.7,.2,1)" }}
        />
      </div>

      {restLeft > 0 && (
        <div className="card animate-pop-in sticky top-16 z-10 flex items-center gap-4 border-accent/60 backdrop-blur-xl">
          <Ring value={restLeft} max={restTotal} size={64} stroke={6}>
            <span className="text-lg font-extrabold tabular-nums">{restLeft}</span>
          </Ring>
          <div className="flex-1">
            <p className="font-semibold">Istirahat dulu 😮‍💨</p>
            <p className="text-xs text-muted">Tarik napas, siap-siap set berikutnya.</p>
          </div>
          <div className="flex flex-col gap-1">
            <button className="btn-ghost px-3 py-1 text-xs" onClick={() => { setRestUntil((r) => (r ?? Date.now()) + 30000); setRestTotal((t) => t + 30); }}>+30 dtk</button>
            <button className="btn-ghost px-3 py-1 text-xs" onClick={() => setRestUntil(null)}>Lewati</button>
          </div>
        </div>
      )}

      {active.exercises.map((e, i) => {
        const tip = suggestNext(e.exerciseId, e.targetReps, e.primaryMuscles, sessions);
        const best = Math.max(0, ...e.sets.filter((s) => s.done).map((s) => estimate1RM(s.weight, s.reps)));
        return (
          <section key={`${e.exerciseId}-${i}`} className="card animate-in space-y-3" style={{ "--d": `${Math.min(i, 6) * 60}ms` } as React.CSSProperties}>
            <div className="flex items-start justify-between gap-3">
              <Link href={`/latihan/${e.exerciseId}`} className="w-20 shrink-0">
                <MotionDemo frames={framesOf(e.exerciseId)} name={e.name} compact hideBadge />
              </Link>
              <div className="min-w-0 flex-1">
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
                  <tr key={k} className={`transition-colors duration-300 ${s.done ? "bg-accent/10 text-accent" : ""}`}>
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
                      <input type="checkbox" checked={s.done}
                        className={`h-6 w-6 cursor-pointer accent-[var(--accent)] ${popKey === `${i}-${k}` ? "animate-pop" : ""}`}
                        aria-label={`Set ${k + 1} selesai`}
                        onChange={(ev) => {
                          updateSet(i, k, { done: ev.target.checked });
                          if (ev.target.checked) {
                            setPopKey(`${i}-${k}`);
                            setNow(Date.now());
                            setRestTotal(REST_SEC);
                            setRestUntil(Date.now() + REST_SEC * 1000);
                            try {
                              navigator.vibrate?.(30);
                            } catch {}
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

      {celebrate && <Celebration title="Sesi selesai! 🎉" subtitle={`${doneSets} set · ${Math.round(sessionVolume(active)).toLocaleString("id-ID")} kg total`} />}

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
