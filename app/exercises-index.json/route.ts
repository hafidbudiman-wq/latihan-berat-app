import { NextResponse } from "next/server";
import { allSummaries } from "@/lib/exercises";

// Dibuat sekali saat build, jadi file statis (juga jalan di GitHub Pages).
export const dynamic = "force-static";

export function GET() {
  return NextResponse.json(allSummaries());
}
