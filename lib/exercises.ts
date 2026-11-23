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

export interface ExerciseQuery {
  q?: string;
  muscle?: string;
  equipment?: string;
  level?: string;
  limit?: number;
}

export function searchExercises({
  q,
  muscle,
  equipment,
  level,
  limit = 60,
}: ExerciseQuery): { total: number; items: ExerciseSummary[] } {
  const terms = (q ?? "").toLowerCase().split(/\s+/).filter(Boolean);
  const matches = EXERCISES.filter((e) => {
    if (muscle && !e.primaryMuscles.includes(muscle)) return false;
    if (equipment && e.equipment !== equipment) return false;
    if (level && e.level !== level) return false;
    const name = e.name.toLowerCase();
    return terms.every((t) => name.includes(t));
  });
  return { total: matches.length, items: matches.slice(0, limit).map(toSummary) };
}

export const EQUIPMENT_OPTIONS = [...new Set(EXERCISES.map((e) => e.equipment))].sort();
