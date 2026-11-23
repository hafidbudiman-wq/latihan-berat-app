"use client";
import { useRouter } from "next/navigation";
import type { ExerciseSummary } from "@/lib/types";
import { newId, useActiveSession, useSessions } from "@/lib/storage";
import { suggestNext } from "@/lib/progression";
import { buildLoggedExercise } from "@/lib/session";

export default function AddToSessionButton({ exercise }: { exercise: ExerciseSummary }) {
  const router = useRouter();
  const [active, setActive] = useActiveSession();
  const [sessions] = useSessions();
  const add = () => {
    const s = suggestNext(exercise.id, 10, exercise.primaryMuscles, sessions);
    const logged = buildLoggedExercise(exercise, 3, 10, s.weight);
    const base = active ?? { id: newId(), date: new Date().toISOString(), title: "Sesi bebas", exercises: [] };
    setActive({ ...base, exercises: [...base.exercises, logged] });
    router.push("/workout");
  };
  return (
    <button onClick={add} className="btn-primary">
      + Tambah ke sesi
    </button>
  );
}
