import { SportsAdapter, NormalizedGame } from "@/types/sports";
import { nbaAdapter } from "@/lib/adapters/nba";
import { worldCupAdapter } from "@/lib/adapters/worldCup";


const adapters: Record<string, SportsAdapter> = {
  nba: nbaAdapter,
  "world-cup": worldCupAdapter,
};

export function getAdapter(leagueId: string): SportsAdapter {
  const adapter = adapters[leagueId];
  if (!adapter) throw new Error(`No sports adapter registered for league "${leagueId}"`);
  return adapter;
}

export async function getScoreboard(leagueId: string, date?: string): Promise<NormalizedGame[]> {
  return getAdapter(leagueId).getScoreboard(date);
}


export async function getScoreboardRange(leagueId: string, daysBack: number = 7): Promise<NormalizedGame[]> {
  return getAdapter(leagueId).getScoreboardRange(daysBack);
}

export async function getAllScoreboardsRange(daysBack: number = 7): Promise<NormalizedGame[]> {
  const results = await Promise.allSettled(
    Object.keys(adapters).map((leagueId) => getScoreboardRange(leagueId, daysBack))
  );
  return results
    .filter((r): r is PromiseFulfilledResult<NormalizedGame[]> => r.status === "fulfilled")
    .flatMap((r) => r.value);
}

export async function getAllScoreboards(date?: string): Promise<NormalizedGame[]> {
  const results = await Promise.allSettled(
    Object.keys(adapters).map((leagueId) => getScoreboard(leagueId, date))
  );
  return results
    .filter((r): r is PromiseFulfilledResult<NormalizedGame[]> => r.status === "fulfilled")
    .flatMap((r) => r.value);
}
