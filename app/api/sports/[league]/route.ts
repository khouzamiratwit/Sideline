import { NextRequest, NextResponse } from "next/server";
import { getScoreboard, getScoreboardRange } from "@/lib/sports-api";

export async function GET(
  req: NextRequest,
  { params }: { params: { league: string } }
) {
  const date = req.nextUrl.searchParams.get("date") ?? undefined;
  const range = req.nextUrl.searchParams.get("range"); 

  try {
    const games = range
      ? await getScoreboardRange(params.league, parseInt(range, 10))
      : await getScoreboard(params.league, date);
    return NextResponse.json(games);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "unknown error" },
      { status: 500 }
    );
  }
}
