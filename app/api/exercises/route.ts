import { NextResponse, type NextRequest } from "next/server";
import { searchExercises } from "@/lib/exercises";

export function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams;
  const result = searchExercises({
    q: p.get("q") ?? undefined,
    muscle: p.get("muscle") ?? undefined,
    equipment: p.get("equipment") ?? undefined,
    level: p.get("level") ?? undefined,
    limit: Math.min(Number(p.get("limit") ?? 30) || 30, 100),
  });
  return NextResponse.json(result);
}
