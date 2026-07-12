import { SportsAdapter, NormalizedGame } from "@/types/sports";
import { nbaAdapter } from "@/lib/adapters/nba";
import { worldCupAdapter } from "@/lib/adapters/worldCup";

// Add a new league by writing an adapter (see lib/adapters/*.ts) and
// registering it here. Nothing else in the app needs to know it exists.
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

// Delegates to each adapter's own efficient range query (single API call
// where the provider supports it) instead of looping day-by-day here --
// keeps us well under free-tier rate limits.
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

// Used by the homepage ticker -- pulls today's games across every
// registered league in parallel and merges them into one list.
export async function getAllScoreboards(date?: string): Promise<NormalizedGame[]> {
  const results = await Promise.allSettled(
    Object.keys(adapters).map((leagueId) => getScoreboard(leagueId, date))
  );
  return results
    .filter((r): r is PromiseFulfilledResult<NormalizedGame[]> => r.status === "fulfilled")
    .flatMap((r) => r.value);
}
