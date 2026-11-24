export interface ProgramExercise {
  exerciseId: string;
  sets: number;
  reps: number;
  restSec: number;
}

export interface ProgramDay {
  key: string;
  title: string;
  focus: string;
  exercises: ProgramExercise[];
}

export interface Program {
  id: string;
  name: string;
  level: "beginner" | "intermediate";
  daysPerWeek: number;
  description: string;
  days: ProgramDay[];
}

const ex = (exerciseId: string, sets: number, reps: number, restSec = 90): ProgramExercise => ({
  exerciseId,
  sets,
  reps,
  restSec,
});

export const PROGRAMS: Program[] = [
  {
    id: "full-body-pemula",
    name: "Full Body Pemula (Dumbel)",
    level: "beginner",
    daysPerWeek: 3,
    description:
      "3x seminggu, selang-seling hari A dan B. Cukup dumbel/kettlebell dan bangku. Fokus teknik dan konsisten naik beban sedikit demi sedikit.",
    days: [
      {
        key: "A",
        title: "Hari A",
        focus: "Squat, dorong, tarik",
        exercises: [
          ex("Goblet_Squat", 3, 10),
          ex("Dumbbell_Bench_Press", 3, 10),
          ex("One-Arm_Dumbbell_Row", 3, 10),
          ex("Seated_Dumbbell_Press", 2, 10),
          ex("Plank", 3, 30, 60),
        ],
      },
      {
        key: "B",
        title: "Hari B",
        focus: "Hinge, lunge, tarik vertikal",
        exercises: [
          ex("Stiff-Legged_Dumbbell_Deadlift", 3, 10),
          ex("Dumbbell_Lunges", 3, 10),
          ex("Pushups", 3, 12),
          ex("Wide-Grip_Lat_Pulldown", 3, 10),
          ex("Hammer_Curls", 2, 12, 60),
        ],
      },
    ],
  },
  {
    id: "upper-lower-menengah",
    name: "Upper / Lower Menengah (Gym)",
    level: "intermediate",
    daysPerWeek: 4,
    description:
      "4x seminggu: Upper, Lower, istirahat, Upper, Lower. Pakai barbel dan mesin gym. Cocok setelah 3-6 bulan latihan rutin.",
    days: [
      {
        key: "U",
        title: "Upper",
        focus: "Dada, punggung, bahu, lengan",
        exercises: [
          ex("Barbell_Bench_Press_-_Medium_Grip", 4, 6, 150),
          ex("Bent_Over_Barbell_Row", 4, 8, 120),
          ex("Standing_Military_Press", 3, 8, 120),
          ex("Wide-Grip_Lat_Pulldown", 3, 10),
          ex("Side_Lateral_Raise", 3, 12, 60),
          ex("Triceps_Pushdown", 3, 12, 60),
        ],
      },
      {
        key: "L",
        title: "Lower",
        focus: "Paha, bokong, betis",
        exercises: [
          ex("Barbell_Squat", 4, 6, 180),
          ex("Romanian_Deadlift", 3, 8, 150),
          ex("Leg_Press", 3, 10, 120),
          ex("Lying_Leg_Curls", 3, 12),
          ex("Barbell_Glute_Bridge", 3, 10),
        ],
      },
    ],
  },
];

export function getProgram(id: string) {
  return PROGRAMS.find((p) => p.id === id);
}
