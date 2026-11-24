"use client";
import Portal from "./Portal";
import { useMemo, useState } from "react";
import type { ExerciseSummary } from "@/lib/types";
import { muscleLabel } from "@/lib/muscles";
import { filterExercises, useExerciseIndex } from "@/lib/exerciseIndex";

export default function ExercisePicker({ onPick, onClose }: { onPick: (e: ExerciseSummary) => void; onClose: () => void }) {
  const [q, setQ] = useState("");
  const { items: all } = useExerciseIndex();
  const items = useMemo(() => (all ? filterExercises(all, { q }).slice(0, 30) : []), [all, q]);
  return (
    <Portal>
    <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/60 sm:items-center" onClick={onClose}>
      <div className="card max-h-[80vh] w-full max-w-lg space-y-3 overflow-hidden rounded-b-none sm:rounded-b-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex gap-2">
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari latihan…" className="input" />
          <button onClick={onClose} className="btn-ghost">Tutup</button>
        </div>
        <ul className="max-h-[60vh] divide-y divide-line overflow-y-auto">
          {!all && <li className="py-2 text-sm text-muted">Memuat…</li>}
          {items.map((e) => (
            <li key={e.id}>
              <button onClick={() => onPick(e)} className="flex w-full items-center gap-3 py-2 text-left hover:text-accent">
                {e.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={e.image} alt="" className="h-10 w-14 rounded bg-white object-cover" loading="lazy" />
                )}
                <span>
                  <span className="block text-sm font-medium">{e.name}</span>
                  <span className="block text-xs text-muted">{e.primaryMuscles.map(muscleLabel).join(", ")}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
    </Portal>
  );
}
