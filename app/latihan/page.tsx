import Link from "next/link";
import { EQUIPMENT_OPTIONS, searchExercises } from "@/lib/exercises";
import { ALL_MUSCLES, muscleLabel } from "@/lib/muscles";
import { EQUIPMENT_LABELS, LEVEL_LABELS, label } from "@/lib/labels";

export const metadata = { title: "Perpustakaan Latihan | Weight Training Agent" };

type SP = Promise<Record<string, string | undefined>>;

export default async function LatihanPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const { total, items } = searchExercises({
    q: sp.q,
    muscle: sp.muscle || undefined,
    equipment: sp.equipment || undefined,
    level: sp.level || undefined,
    limit: 60,
  });
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Perpustakaan Latihan</h1>
        <p className="text-sm text-muted">876 latihan dengan foto, instruksi, dan otot yang dilatih.</p>
      </div>
      <form className="card grid gap-2 sm:grid-cols-5" method="get">
        <input name="q" defaultValue={sp.q} placeholder="Cari nama latihan (mis. squat)" className="input sm:col-span-2" />
        <select name="muscle" defaultValue={sp.muscle ?? ""} className="input">
          <option value="">Semua otot</option>
          {ALL_MUSCLES.map((m) => (
            <option key={m} value={m}>{muscleLabel(m)}</option>
          ))}
        </select>
        <select name="equipment" defaultValue={sp.equipment ?? ""} className="input">
          <option value="">Semua alat</option>
          {EQUIPMENT_OPTIONS.map((e) => (
            <option key={e} value={e}>{label(EQUIPMENT_LABELS, e)}</option>
          ))}
        </select>
        <div className="flex gap-2">
          <select name="level" defaultValue={sp.level ?? ""} className="input">
            <option value="">Semua level</option>
            {Object.entries(LEVEL_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <button className="btn-primary">Cari</button>
        </div>
      </form>
      <p className="text-sm text-muted">
        {total} hasil{total > items.length ? `, menampilkan ${items.length} pertama` : ""}
      </p>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((e) => (
          <li key={e.id}>
            <Link href={`/latihan/${e.id}`} className="card block h-full p-0 overflow-hidden hover:border-accent">
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
    </div>
  );
}
