import { test } from "node:test";
import assert from "node:assert/strict";
import { estimate1RM, suggestNext, weeklySetsByMuscle } from "./progression.ts";
import { ruleBasedReply } from "./coach.ts";
import type { WorkoutSession } from "./types.ts";

const session = (date: string, weight: number, reps: number[], target = 10): WorkoutSession => ({
  id: date,
  date,
  title: "Hari A",
  exercises: [
    {
      exerciseId: "Goblet_Squat",
      name: "Goblet Squat",
      primaryMuscles: ["quadriceps"],
      secondaryMuscles: ["glutes"],
      targetReps: target,
      sets: reps.map((r) => ({ reps: r, weight, done: true })),
    },
  ],
});

test("tanpa riwayat -> mulai", () => {
  assert.equal(suggestNext("Goblet_Squat", 10, ["quadriceps"], []).action, "mulai");
});

test("semua set tuntas -> naik 5 kg untuk tubuh bawah", () => {
  const s = suggestNext("Goblet_Squat", 10, ["quadriceps"], [session("2026-11-20", 20, [10, 10, 10])]);
  assert.equal(s.action, "naik");
  assert.equal(s.weight, 25);
});

test("tubuh atas naik 2,5 kg", () => {
  const s = suggestNext("Goblet_Squat", 10, ["chest"], [session("2026-11-20", 20, [10, 10, 10])]);
  assert.equal(s.weight, 22.5);
});

test("gagal sekali -> tahan", () => {
  const s = suggestNext("Goblet_Squat", 10, ["quadriceps"], [session("2026-11-20", 20, [10, 9, 8])]);
  assert.equal(s.action, "tahan");
  assert.equal(s.weight, 20);
});

test("gagal dua kali berturut-turut -> deload 10%", () => {
  const s = suggestNext("Goblet_Squat", 10, ["quadriceps"], [
    session("2026-11-18", 20, [10, 8, 8]),
    session("2026-11-20", 20, [9, 8, 7]),
  ]);
  assert.equal(s.action, "turun");
  assert.equal(s.weight, 18);
});

test("set mingguan: primer 1, sekunder 0,5, di luar 7 hari diabaikan", () => {
  const w = weeklySetsByMuscle(
    [session("2026-11-20T10:00:00Z", 20, [10, 10, 10]), session("2026-11-01T10:00:00Z", 20, [10])],
    new Date("2026-11-23T00:00:00Z"),
  );
  assert.deepEqual(w, { quadriceps: 3, glutes: 1.5 });
});

test("estimasi 1RM Epley", () => {
  assert.equal(estimate1RM(100, 5), 116.7);
  assert.equal(estimate1RM(100, 1), 100);
});

test("coach offline menanggapi keluhan nyeri dengan aman", () => {
  assert.match(ruleBasedReply("lutut saya nyeri", {}, []), /dokter|fisioterapis/);
});
