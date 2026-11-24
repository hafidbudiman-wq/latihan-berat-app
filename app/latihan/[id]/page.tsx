import { notFound } from "next/navigation";
import Link from "next/link";
import { allIds, getExercise, toSummary } from "@/lib/exercises";
import { muscleLabel } from "@/lib/muscles";
import { CATEGORY_LABELS, EQUIPMENT_LABELS, LEVEL_LABELS, imageUrl, label, videoSearchUrl } from "@/lib/labels";
import MotionDemo from "@/components/MotionDemo";
import BodyMap from "@/components/BodyMap";
import AddToSessionButton from "@/components/AddToSessionButton";

type P = Promise<{ id: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return allIds().map((id) => ({ id }));
}

export async function generateMetadata({ params }: { params: P }) {
  const e = getExercise((await params).id);
  return { title: e ? `${e.name} | Weight Training Agent` : "Latihan tidak ditemukan" };
}

export default async function ExerciseDetail({ params }: { params: P }) {
  const e = getExercise((await params).id);
  if (!e) notFound();
  return (
    <div className="space-y-4">
      <Link href="/latihan" className="text-sm text-muted hover:text-accent">← Perpustakaan</Link>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">{e.name}</h1>
          <div className="mt-1 flex flex-wrap gap-1">
            <span className="chip">{label(LEVEL_LABELS, e.level)}</span>
            <span className="chip">{label(EQUIPMENT_LABELS, e.equipment)}</span>
            <span className="chip">{label(CATEGORY_LABELS, e.category)}</span>
            {e.mechanic && <span className="chip">{e.mechanic === "compound" ? "Compound" : "Isolasi"}</span>}
          </div>
        </div>
        <AddToSessionButton exercise={toSummary(e)} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="card animate-in space-y-3" style={{ "--d": "80ms" } as React.CSSProperties}>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Contoh gerakan</h2>
            <span className="text-xs text-muted">posisi awal ⇄ akhir</span>
          </div>
          <MotionDemo frames={e.images.map(imageUrl)} name={e.name} />
          <a
            href={videoSearchUrl(e.name)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn w-full bg-[#ff0033] text-white shadow-[0_8px_24px_-10px_#ff0033aa] hover:brightness-110"
          >
            ▶ Tonton video tutorial di YouTube
          </a>
        </div>
        <div className="card animate-in space-y-3" style={{ "--d": "160ms" } as React.CSSProperties}>
          <h2 className="font-semibold">Otot yang dilatih</h2>
          <BodyMap primary={e.primaryMuscles} secondary={e.secondaryMuscles} />
          <p className="text-sm">
            <span className="text-accent">Utama:</span> {e.primaryMuscles.map(muscleLabel).join(", ")}
          </p>
          {e.secondaryMuscles.length > 0 && (
            <p className="text-sm">
              <span className="text-muted">Pendukung:</span> {e.secondaryMuscles.map(muscleLabel).join(", ")}
            </p>
          )}
        </div>
      </div>

      <div className="card animate-in" style={{ "--d": "240ms" } as React.CSSProperties}>
        <h2 className="mb-2 font-semibold">Cara melakukan</h2>
        <ol className="space-y-3 text-sm leading-relaxed">
          {e.instructions.map((s, i) => (
            <li key={i} className="flex gap-3">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent/15 text-xs font-bold text-accent">{i + 1}</span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
        <p className="mt-3 text-xs text-muted">Instruksi masih dalam bahasa Inggris dari dataset asli.</p>
      </div>
    </div>
  );
}
