"use client";
import { useEffect, useState } from "react";
import type { ExerciseSummary } from "./types";

export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

let cache: Promise<ExerciseSummary[]> | null = null;

/** Memuat daftar ringkas semua latihan (sekali, lalu di-cache). */
export function loadExerciseIndex(): Promise<ExerciseSummary[]> {
  cache ??= fetch(`${BASE_PATH}/exercises-index.json`)
    .then((r) => {
      if (!r.ok) throw new Error(String(r.status));
      return r.json();
    })
    .catch((err) => {
      cache = null;
      throw err;
    });
  return cache;
}

export function useExerciseIndex() {
  const [items, setItems] = useState<ExerciseSummary[] | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    loadExerciseIndex().then(setItems, () => setError(true));
  }, []);
  return { items, error };
}

export interface ExerciseFilter {
  q?: string;
  muscle?: string;
  equipment?: string;
  level?: string;
}

export function filterExercises(items: ExerciseSummary[], f: ExerciseFilter): ExerciseSummary[] {
  const terms = (f.q ?? "").toLowerCase().split(/\s+/).filter(Boolean);
  return items.filter((e) => {
    if (f.muscle && !e.primaryMuscles.includes(f.muscle)) return false;
    if (f.equipment && e.equipment !== f.equipment) return false;
    if (f.level && e.level !== f.level) return false;
    const name = e.name.toLowerCase();
    return terms.every((t) => name.includes(t));
  });
}
