// Common shape every league adapter (NBA, World Cup, etc.) normalizes into.
// The UI only ever talks to these types -- it never sees raw API responses,
// so adding a new league later means writing one adapter, not touching pages.

export type GameStatus = "scheduled" | "live" | "final";

export interface NormalizedTeam {
  id: string;          // namespaced, e.g. "nba:lakers"
  name: string;
  abbreviation: string;
  logoUrl?: string;
  score?: number;
}

export interface NormalizedGame {
  id: string;           // namespaced, e.g. "nba:2026-07-04:LAL@BOS"
  leagueId: string;      // "nba" | "world-cup" | ...
  status: GameStatus;
  startTime: string;     // ISO 8601
  period?: string;       // "Q3", "78'", "Final", etc. -- league-specific label
  home: NormalizedTeam;
  away: NormalizedTeam;
}

export interface NormalizedPlayerStatLine {
  playerId: string;
  playerName: string;
  teamId: string;
  // Deliberately loose: a box score's shape differs wildly by sport
  // (points/rebounds/assists vs goals/shots/passes). Adapters populate
  // whatever's relevant and the UI renders keys generically.
  stats: Record<string, number | string>;
}

// Every league adapter implements this interface.
export interface SportsAdapter {
  leagueId: string;
  getScoreboard(date?: string): Promise<NormalizedGame[]>;
  // Fetches games across a range of recent days in as few API calls as
  // possible (ideally one) -- used by the Games list page so it isn't
  // limited to "only what's happening today."
  getScoreboardRange(daysBack: number): Promise<NormalizedGame[]>;
  getGameBoxScore(gameId: string): Promise<NormalizedPlayerStatLine[]>;
}
