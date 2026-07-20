

export type GameStatus = "scheduled" | "live" | "final";

export interface NormalizedTeam {
  id: string;  
  name: string;
  abbreviation: string;
  logoUrl?: string;
  score?: number;
}

export interface NormalizedGame {
  id: string;         
  leagueId: string;   
  status: GameStatus;
  startTime: string;   
  period?: string;      
  home: NormalizedTeam;
  away: NormalizedTeam;
}

export interface NormalizedPlayerStatLine {
  playerId: string;
  playerName: string;
  teamId: string;

  stats: Record<string, number | string>;
}


export interface SportsAdapter {
  leagueId: string;
  getScoreboard(date?: string): Promise<NormalizedGame[]>;

  getScoreboardRange(daysBack: number): Promise<NormalizedGame[]>;
  getGameBoxScore(gameId: string): Promise<NormalizedPlayerStatLine[]>;
}
