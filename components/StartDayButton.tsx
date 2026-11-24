"use client";
import { useRouter } from "next/navigation";
import type { ExerciseSummary } from "@/lib/types";
import type { ProgramExercise } from "@/lib/programs";
import { newId, useActiveSession, useSessions } from "@/lib/storage";
import { suggestNext } from "@/lib/progression";
import { buildLoggedExercise } from "@/lib/session";

export type DayItem = ProgramExercise & { exercise: ExerciseSummary };

export default function StartDayButton({ title, items }: { title: string; items: DayItem[] }) {
  const router = useRouter();
  const [active, setActive] = useActiveSession();
  const [sessions] = useSessions();
  const start = () => {
    if (active && active.exercises.length && !confirmReplace()) return;
    setActive({
      id: newId(),
      date: new Date().toISOString(),
      title,
      exercises: items.map((x) => {
        const s = suggestNext(x.exerciseId, x.reps, x.exercise.primaryMuscles, sessions);
        return buildLoggedExercise(x.exercise, x.sets, x.reps, s.weight);
      }),
    });
    router.push("/workout");
  };
  return (
    <button onClick={start} className="btn-primary shrink-0 text-sm">
      Mulai
    </button>
  );
}

function confirmReplace() {
  return window.confirm("Ada sesi yang belum selesai. Ganti dengan sesi baru?");
}
