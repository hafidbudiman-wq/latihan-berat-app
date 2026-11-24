export type Level = "beginner" | "intermediate" | "expert";

export interface Exercise {
  id: string;
  name: string;
  level: Level;
  mechanic: string | null;
  force: string | null;
  equipment: string;
  category: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  instructions: string[];
  images: string[];
}

/** Ringkasan latihan yang dikirim ke client (tanpa instruksi panjang). */
export interface ExerciseSummary {
  id: string;
  name: string;
  equipment: string;
  level: Level;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  image: string | null;
  /** Semua frame gerakan (posisi awal & akhir) untuk demo animasi. */
  frames: string[];
}

export interface SetEntry {
  reps: number;
  weight: number; // kg
  done: boolean;
}

export interface LoggedExercise {
  exerciseId: string;
  name: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  targetReps: number;
  sets: SetEntry[];
}

export interface WorkoutSession {
  id: string;
  date: string; // ISO
  title: string;
  exercises: LoggedExercise[];
  notes?: string;
}
