import type { ExerciseSummary, LoggedExercise } from "./types.ts";

export function buildLoggedExercise(
  e: Pick<ExerciseSummary, "id" | "name" | "primaryMuscles" | "secondaryMuscles">,
  sets: number,
  reps: number,
  weight: number,
): LoggedExercise {
  return {
    exerciseId: e.id,
    name: e.name,
    primaryMuscles: e.primaryMuscles,
    secondaryMuscles: e.secondaryMuscles,
    targetReps: reps,
    sets: Array.from({ length: sets }, () => ({ reps, weight, done: false })),
  };
}
