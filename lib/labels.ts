export const EQUIPMENT_LABELS: Record<string, string> = {
  barbell: "Barbel",
  dumbbell: "Dumbel",
  "body only": "Berat badan",
  cable: "Kabel",
  machine: "Mesin",
  kettlebells: "Kettlebell",
  bands: "Resistance band",
  "medicine ball": "Medicine ball",
  "exercise ball": "Gym ball",
  "foam roll": "Foam roller",
  "e-z curl bar": "EZ bar",
  other: "Lainnya",
};

export const LEVEL_LABELS: Record<string, string> = {
  beginner: "Pemula",
  intermediate: "Menengah",
  expert: "Mahir",
};

export const CATEGORY_LABELS: Record<string, string> = {
  strength: "Kekuatan",
  stretching: "Peregangan",
  plyometrics: "Pliometrik",
  powerlifting: "Powerlifting",
  "olympic weightlifting": "Angkat besi olimpiade",
  strongman: "Strongman",
  cardio: "Kardio",
};

export const label = (map: Record<string, string>, key: string) =>
  map[key] ?? key;

export const IMAGE_BASE =
  "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/";

export const imageUrl = (path: string) => IMAGE_BASE + path;
