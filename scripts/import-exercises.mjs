// Mengunduh dataset latihan dari yuhonas/free-exercise-db (Unlicense / public domain)
// dan menyimpannya ke data/exercises.json dalam format yang lebih ringkas.
//
// Jalankan: npm run import:exercises
import { writeFile } from "node:fs/promises";

const SOURCE =
  "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json";

const res = await fetch(SOURCE);
if (!res.ok) throw new Error(`Gagal mengunduh dataset: ${res.status}`);
const raw = await res.json();

const exercises = raw
  .map((e) => ({
    id: e.id,
    name: e.name,
    level: e.level,
    mechanic: e.mechanic ?? null,
    force: e.force ?? null,
    equipment: e.equipment ?? "other",
    category: e.category,
    primaryMuscles: e.primaryMuscles,
    secondaryMuscles: e.secondaryMuscles,
    instructions: e.instructions,
    images: e.images,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

await writeFile(
  new URL("../data/exercises.json", import.meta.url),
  JSON.stringify(exercises),
);
console.log(`Tersimpan ${exercises.length} latihan ke data/exercises.json`);
