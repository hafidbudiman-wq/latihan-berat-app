"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { filterExercises, useExerciseIndex, type ExerciseFilter } from "@/lib/exerciseIndex";
import { ALL_MUSCLES, muscleLabel } from "@/lib/muscles";
import { EQUIPMENT_LABELS, LEVEL_LABELS, label } from "@/lib/labels";

const PAGE = 60;

export default function LibraryBrowser() {
  const { items, error } = useExerciseIndex();
  const [f, setF] = useState<ExerciseFilter>({});
  const [shown, setShown] = useState(PAGE);
  const set = (patch: ExerciseFilter) => {
    setF({ ...f, ...patch });
    setShown(PAGE);
  };
  const equipment = useMemo(() => [...new Set((items ?? []).map((e) => e.equipment))].sort(), [items]);
  const results = useMemo(() => (items ? filterExercises(items, f) : []), [items, f]);

  if (error) return <p className="card text-danger">Gagal memuat daftar latihan. Coba muat ulang halaman.</p>;

  return (
    <>
      <div className="card grid gap-2 sm:grid-cols-5">
        <input value={f.q ?? ""} onChange={(e) => set({ q: e.target.value })} placeholder="Cari nama latihan (mis. squat)" className="input sm:col-span-2" />
        <select value={f.muscle ?? ""} onChange={(e) => set({ muscle: e.target.value || undefined })} className="input" aria-label="Otot">
          <option value="">Semua otot</option>
          {ALL_MUSCLES.map((m) => <option key={m} value={m}>{muscleLabel(m)}</option>)}
        </select>
        <select value={f.equipment ?? ""} onChange={(e) => set({ equipment: e.target.value || undefined })} className="input" aria-label="Alat">
          <option value="">Semua alat</option>
          {equipment.map((e) => <option key={e} value={e}>{label(EQUIPMENT_LABELS, e)}</option>)}
        </select>
        <select value={f.level ?? ""} onChange={(e) => set({ level: e.target.value || undefined })} className="input" aria-label="Level">
          <option value="">Semua level</option>
          {Object.entries(LEVEL_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>
      <p className="text-sm text-muted">
        {items ? `${results.length} hasil` : "Memuat…"}
        {results.length > shown ? `, menampilkan ${shown} pertama` : ""}
      </p>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {results.slice(0, shown).map((e) => (
          <li key={e.id}>
            <Link href={`/latihan/${e.id}`} className="card block h-full overflow-hidden p-0 hover:border-accent">
              {e.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={e.image} alt={e.name} loading="lazy" className="aspect-[4/3] w-full bg-white object-cover" />
              )}
              <div className="space-y-1 p-3">
                <p className="font-semibold leading-tight">{e.name}</p>
                <p className="text-xs text-muted">
                  {e.primaryMuscles.map(muscleLabel).join(", ")} · {label(EQUIPMENT_LABELS, e.equipment)}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      {results.length > shown && (
        <button className="btn-ghost w-full" onClick={() => setShown(shown + PAGE)}>Tampilkan lebih banyak</button>
      )}
    </>
  );
}
