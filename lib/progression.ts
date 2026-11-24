import type { LoggedExercise, WorkoutSession } from "./types.ts";

const LOWER_BODY = new Set(["quadriceps", "hamstrings", "glutes", "adductors", "abductors", "lower back"]);

export interface Suggestion {
  weight: number;
  reps: number;
  action: "naik" | "tahan" | "turun" | "mulai";
  reason: string;
}

/** Kenaikan beban yang wajar: tubuh bawah naik lebih besar dari tubuh atas. */
export function weightIncrement(muscles: string[]): number {
  return muscles.some((m) => LOWER_BODY.has(m)) ? 5 : 2.5;
}

/** Sesi terbaru dulu, hanya yang memuat latihan ini. */
export function historyFor(exerciseId: string, sessions: WorkoutSession[]): LoggedExercise[] {
  return [...sessions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .flatMap((s) => s.exercises.filter((e) => e.exerciseId === exerciseId));
}

function hitTarget(e: LoggedExercise): boolean {
  const done = e.sets.filter((s) => s.done);
  return done.length > 0 && done.length === e.sets.length && done.every((s) => s.reps >= e.targetReps);
}

function topWeight(e: LoggedExercise): number {
  return Math.max(0, ...e.sets.filter((s) => s.done).map((s) => s.weight));
}

const round = (w: number) => Math.round(w * 2) / 2;

/**
 * Aturan progressive overload sederhana (double progression):
 * - semua set capai target reps -> naikkan beban
 * - gagal target 1x -> tahan beban yang sama
 * - gagal target 2 sesi berturut-turut -> turunkan ~10% (deload)
 */
export function suggestNext(
  exerciseId: string,
  targetReps: number,
  muscles: string[],
  sessions: WorkoutSession[],
): Suggestion {
  const [last, prev] = historyFor(exerciseId, sessions);
  if (!last) {
    return {
      weight: 0,
      reps: targetReps,
      action: "mulai",
      reason: "Belum ada riwayat. Mulai dengan beban yang bisa kamu angkat dengan teknik rapi, sisakan 2-3 repetisi.",
    };
  }
  const w = topWeight(last);
  if (hitTarget(last)) {
    const inc = w === 0 ? 0 : weightIncrement(muscles);
    return {
      weight: round(w + inc),
      reps: targetReps,
      action: inc === 0 ? "tahan" : "naik",
      reason:
        inc === 0
          ? "Semua set tuntas. Latihan berat badan: tambah 1-2 repetisi per set."
          : `Semua set tuntas di ${w} kg. Naikkan ${inc} kg.`,
    };
  }
  if (prev && !hitTarget(prev) && topWeight(prev) === w && w > 0) {
    return {
      weight: round(w * 0.9),
      reps: targetReps,
      action: "turun",
      reason: `Dua sesi berturut-turut belum capai target di ${w} kg. Deload ~10%, lalu bangun lagi.`,
    };
  }
  return {
    weight: w,
    reps: targetReps,
    action: "tahan",
    reason: `Belum semua set capai ${targetReps} repetisi. Tahan di ${w} kg sampai tuntas.`,
  };
}

/** Jumlah set per otot dalam rentang hari tertentu (otot sekunder dihitung 0,5). */
export function weeklySetsByMuscle(
  sessions: WorkoutSession[],
  now: Date = new Date(),
  days = 7,
): Record<string, number> {
  const since = now.getTime() - days * 24 * 60 * 60 * 1000;
  const out: Record<string, number> = {};
  for (const s of sessions) {
    if (new Date(s.date).getTime() < since) continue;
    for (const e of s.exercises) {
      const n = e.sets.filter((x) => x.done).length;
      if (!n) continue;
      for (const m of e.primaryMuscles) out[m] = (out[m] ?? 0) + n;
      for (const m of e.secondaryMuscles) out[m] = (out[m] ?? 0) + n * 0.5;
    }
  }
  return out;
}

/** Total tonase (kg x reps) satu sesi. */
export function sessionVolume(s: WorkoutSession): number {
  return s.exercises.reduce(
    (sum, e) => sum + e.sets.filter((x) => x.done).reduce((a, x) => a + x.weight * x.reps, 0),
    0,
  );
}

/** Estimasi 1RM (rumus Epley). */
export function estimate1RM(weight: number, reps: number): number {
  if (reps <= 0 || weight <= 0) return 0;
  if (reps === 1) return weight;
  return Math.round(weight * (1 + reps / 30) * 10) / 10;
}
