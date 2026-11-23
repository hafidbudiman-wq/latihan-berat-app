import "server-only";
import data from "@/data/exercises.json";
import type { Exercise, ExerciseSummary } from "./types";
import { imageUrl } from "./labels";

const EXERCISES = data as Exercise[];
const BY_ID = new Map(EXERCISES.map((e) => [e.id, e]));

export function getExercise(id: string): Exercise | undefined {
  return BY_ID.get(id);
}

export function toSummary(e: Exercise): ExerciseSummary {
  return {
    id: e.id,
    name: e.name,
    equipment: e.equipment,
    level: e.level,
    primaryMuscles: e.primaryMuscles,
    secondaryMuscles: e.secondaryMuscles,
    image: e.images[0] ? imageUrl(e.images[0]) : null,
  };
}

export function allSummaries(): ExerciseSummary[] {
  return EXERCISES.map(toSummary);
}

export function allIds(): string[] {
  return EXERCISES.map((e) => e.id);
}
