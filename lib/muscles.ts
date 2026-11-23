import type { Muscle } from "react-body-highlighter";

/** Nama otot di free-exercise-db -> label Bahasa Indonesia. */
export const MUSCLE_LABELS: Record<string, string> = {
  abdominals: "Perut (abs)",
  abductors: "Paha luar (abduktor)",
  adductors: "Paha dalam (adduktor)",
  biceps: "Bisep",
  calves: "Betis",
  chest: "Dada",
  forearms: "Lengan bawah",
  glutes: "Bokong (glutes)",
  hamstrings: "Paha belakang (hamstring)",
  lats: "Punggung samping (lats)",
  "lower back": "Punggung bawah",
  "middle back": "Punggung tengah",
  neck: "Leher",
  quadriceps: "Paha depan (quads)",
  shoulders: "Bahu",
  traps: "Trapezius",
  triceps: "Trisep",
};

/** Nama otot di free-exercise-db -> otot di peta tubuh react-body-highlighter. */
export const MUSCLE_TO_MAP: Record<string, Muscle[]> = {
  abdominals: ["abs", "obliques"],
  abductors: ["abductors"],
  adductors: ["adductor"],
  biceps: ["biceps"],
  calves: ["calves", "left-soleus", "right-soleus"],
  chest: ["chest"],
  forearms: ["forearm"],
  glutes: ["gluteal"],
  hamstrings: ["hamstring"],
  lats: ["upper-back"],
  "lower back": ["lower-back"],
  "middle back": ["upper-back"],
  neck: ["neck"],
  quadriceps: ["quadriceps"],
  shoulders: ["front-deltoids", "back-deltoids"],
  traps: ["trapezius"],
  triceps: ["triceps"],
};

export const ALL_MUSCLES = Object.keys(MUSCLE_LABELS);

export function muscleLabel(m: string): string {
  return MUSCLE_LABELS[m] ?? m;
}

export function toMapMuscles(muscles: string[]): Muscle[] {
  return [...new Set(muscles.flatMap((m) => MUSCLE_TO_MAP[m] ?? []))];
}
