import { notFound } from "next/navigation";
import Link from "next/link";
import { getExercise, toSummary } from "@/lib/exercises";
import { muscleLabel } from "@/lib/muscles";
import { CATEGORY_LABELS, EQUIPMENT_LABELS, LEVEL_LABELS, imageUrl, label } from "@/lib/labels";
import BodyMap from "@/components/BodyMap";
import AddToSessionButton from "@/components/AddToSessionButton";

type P = Promise<{ id: string }>;

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
          <h1 className="text-2xl font-bold">{e.name}</h1>
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
        <div className="card space-y-3">
          <h2 className="font-semibold">Gerakan</h2>
          <div className="grid grid-cols-2 gap-2">
            {e.images.map((img, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={img} src={imageUrl(img)} alt={`${e.name} posisi ${i + 1}`} className="rounded-xl bg-white" />
            ))}
          </div>
          <p className="text-xs text-muted">Foto: posisi awal dan akhir.</p>
        </div>
        <div className="card space-y-3">
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

      <div className="card">
        <h2 className="mb-2 font-semibold">Cara melakukan</h2>
        <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed">
          {e.instructions.map((s, i) => <li key={i}>{s}</li>)}
        </ol>
        <p className="mt-3 text-xs text-muted">Instruksi masih dalam bahasa Inggris dari dataset asli.</p>
      </div>
    </div>
  );
}
