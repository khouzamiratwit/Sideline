import { NormalizedGame, NormalizedPlayerStatLine, SportsAdapter } from "@/types/sports";


const BASE_URL = "https://api.football-data.org/v4";
const COMPETITION = "WC"; 

function authHeaders(): HeadersInit {
  const token = process.env.FOOTBALL_DATA_API_KEY;
  return token ? { "X-Auth-Token": token } : {};
}

function mapStatus(apiStatus: string): NormalizedGame["status"] {
  if (apiStatus === "FINISHED") return "final";
  if (apiStatus === "IN_PLAY" || apiStatus === "PAUSED") return "live";
  return "scheduled";
}

function mapGame(m: any): NormalizedGame {
  return {
    id: `world-cup:${m.id}`,
    leagueId: "world-cup",
    status: mapStatus(m.status),
    startTime: m.utcDate,
    period: m.minute ? `${m.minute}'` : m.status,
    home: {
      id: `world-cup:${m.homeTeam.id}`,
      name: m.homeTeam.name,
      abbreviation: m.homeTeam.tla ?? m.homeTeam.shortName,
      logoUrl: m.homeTeam.crest,
      score: m.score?.fullTime?.home ?? undefined,
    },
    away: {
      id: `world-cup:${m.awayTeam.id}`,
      name: m.awayTeam.name,
      abbreviation: m.awayTeam.tla ?? m.awayTeam.shortName,
      logoUrl: m.awayTeam.crest,
      score: m.score?.fullTime?.away ?? undefined,
    },
  };
}

export const worldCupAdapter: SportsAdapter = {
  leagueId: "world-cup",

  async getScoreboard(date?: string): Promise<NormalizedGame[]> {
    const day = date ?? new Date().toISOString().slice(0, 10);
    const res = await fetch(
      `${BASE_URL}/competitions/${COMPETITION}/matches?dateFrom=${day}&dateTo=${day}`,
      { headers: authHeaders(), next: { revalidate: 30 } }
    );
    if (!res.ok) throw new Error(`World Cup scoreboard fetch failed: ${res.status}`);
    const json = await res.json();
    return (json.matches ?? []).map(mapGame);
  },

  async getScoreboardRange(daysBack: number): Promise<NormalizedGame[]> {
    // football-data.org accepts a native date range in one call, so this
    // is far more rate-limit-friendly than looping day by day.
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - daysBack);
    const dateFrom = from.toISOString().slice(0, 10);
    const dateTo = to.toISOString().slice(0, 10);

    const res = await fetch(
      `${BASE_URL}/competitions/${COMPETITION}/matches?dateFrom=${dateFrom}&dateTo=${dateTo}`,
      { headers: authHeaders(), next: { revalidate: 60 } }
    );
    if (!res.ok) throw new Error(`World Cup range fetch failed: ${res.status}`);
    const json = await res.json();
    return (json.matches ?? []).map(mapGame);
  },

  async getGameBoxScore(gameId: string): Promise<NormalizedPlayerStatLine[]> {
    const rawId = gameId.split(":").pop();
    const res = await fetch(`${BASE_URL}/matches/${rawId}`, {
      headers: authHeaders(),
      next: { revalidate: 30 },
    });
    if (!res.ok) throw new Error(`World Cup match detail fetch failed: ${res.status}`);
    const json = await res.json();

    // football-data's free tier doesn't include full player box scores;
    // this returns goal scorers as a minimal stat line. Upgrade to a
    // provider like API-Football for full player stats if you need them.
    const goals = json.goals ?? [];
    return goals.map((g: any): NormalizedPlayerStatLine => ({
      playerId: `world-cup:${g.scorer.id}`,
      playerName: g.scorer.name,
      teamId: `world-cup:${g.team.id}`,
      stats: { goal_minute: g.minute },
    }));
  },
};
