import { NormalizedGame, NormalizedPlayerStatLine, SportsAdapter } from "@/types/sports";


const BASE_URL = "https://api.balldontlie.io/v1";

function authHeaders(): HeadersInit {
  const key = process.env.BALLDONTLIE_API_KEY;
  return key ? { Authorization: key } : {};
}

function mapGame(g: any): NormalizedGame {
  return {
    id: `nba:${g.date}:${g.visitor_team.abbreviation}@${g.home_team.abbreviation}`,
    leagueId: "nba",
    status: g.status === "Final" ? "final" : g.time ? "live" : "scheduled",
    startTime: g.date,
    period: g.status,
    home: {
      id: `nba:${g.home_team.abbreviation.toLowerCase()}`,
      name: g.home_team.full_name,
      abbreviation: g.home_team.abbreviation,
      score: g.home_team_score,
    },
    away: {
      id: `nba:${g.visitor_team.abbreviation.toLowerCase()}`,
      name: g.visitor_team.full_name,
      abbreviation: g.visitor_team.abbreviation,
      score: g.visitor_team_score,
    },
  };
}

async function fetchRange(startDaysBack: number, endDaysBack: number = 0): Promise<NormalizedGame[]> {
  const from = new Date();
  from.setDate(from.getDate() - startDaysBack);
  const to = new Date();
  to.setDate(to.getDate() - endDaysBack);
  const startDate = from.toISOString().slice(0, 10);
  const endDate = to.toISOString().slice(0, 10);

  const res = await fetch(
    `${BASE_URL}/games?start_date=${startDate}&end_date=${endDate}&per_page=100`,
    { headers: authHeaders(), next: { revalidate: 300 } }
  );
  if (!res.ok) throw new Error(`NBA range fetch failed: ${res.status}`);
  const json = await res.json();
  return (json.data ?? []).map(mapGame);
}

export const nbaAdapter: SportsAdapter = {
  leagueId: "nba",

  async getScoreboard(date?: string): Promise<NormalizedGame[]> {
    const day = date ?? new Date().toISOString().slice(0, 10);
    const res = await fetch(`${BASE_URL}/games?dates[]=${day}`, {
      headers: authHeaders(),
      next: { revalidate: 30 }, // cache 30s, this endpoint changes during live games
    });
    if (!res.ok) throw new Error(`NBA scoreboard fetch failed: ${res.status}`);
    const json = await res.json();
    return (json.data ?? []).map(mapGame);
  },

  async getScoreboardRange(daysBack: number): Promise<NormalizedGame[]> {
  
    const recentDays = Math.min(daysBack, 45);
    const [recent, earlier] = await Promise.all([
      fetchRange(daysBack > 0 ? recentDays : 0),
      daysBack > recentDays ? fetchRange(daysBack, recentDays) : Promise.resolve([]),
    ]);

    const seen = new Set<string>();
    return [...recent, ...earlier].filter((g) => (seen.has(g.id) ? false : (seen.add(g.id), true)));
  },

  async getGameBoxScore(gameId: string): Promise<NormalizedPlayerStatLine[]> {
   
    const rawId = gameId.split(":").pop();
    const res = await fetch(`${BASE_URL}/stats?game_ids[]=${rawId}`, {
      headers: authHeaders(),
      next: { revalidate: 30 },
    });
    if (!res.ok) throw new Error(`NBA box score fetch failed: ${res.status}`);
    const json = await res.json();

    return (json.data ?? []).map((s: any): NormalizedPlayerStatLine => ({
      playerId: `nba:${s.player.id}`,
      playerName: `${s.player.first_name} ${s.player.last_name}`,
      teamId: `nba:${s.team.abbreviation.toLowerCase()}`,
      stats: {
        pts: s.pts,
        reb: s.reb,
        ast: s.ast,
        min: s.min,
      },
    }));
  },
};
