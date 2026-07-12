"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import { NormalizedGame } from "@/types/sports";

const LEAGUES = [
  { id: "all", label: "All Leagues" },
  { id: "nba", label: "NBA" },
  { id: "world-cup", label: "World Cup" },
];

const STATUSES = [
  { id: "all", label: "All Statuses" },
  { id: "scheduled", label: "Scheduled" },
  { id: "live", label: "Live" },
  { id: "final", label: "Final" },
];

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function GameRow({ game }: { game: NormalizedGame }) {
  const dateLabel = (() => {
    try {
      return new Date(game.startTime).toLocaleDateString(undefined, { month: "short", day: "numeric" });
    } catch {
      return "";
    }
  })();

  const hasScore = game.home.score !== undefined && game.away.score !== undefined;

  return (
    <div className="flex items-center justify-between border border-court-line rounded-card bg-court-panel px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-court-bg border border-court-line shrink-0" />
        <span className="text-sm text-chalk font-medium w-24">{game.away.name}</span>
        {hasScore && <span className="font-mono text-sm font-semibold text-chalk">{game.away.score}</span>}
        <span className="text-xs text-chalk-dim">vs</span>
        {hasScore && <span className="font-mono text-sm font-semibold text-chalk">{game.home.score}</span>}
        <div className="w-9 h-9 rounded-full bg-court-bg border border-court-line shrink-0" />
        <span className="text-sm text-chalk font-medium w-24">{game.home.name}</span>
      </div>
      <div className="text-xs text-chalk-dim text-right hidden sm:block">
        <div>{dateLabel}</div>
        <div>{game.status === "final" ? "Final" : game.period ?? "Scheduled"}</div>
      </div>
      <Link
        href={`/league/${game.leagueId}`}
        className="text-xs bg-court-bg border border-court-line rounded-card px-3 py-1.5 text-chalk hover:border-signal-orange/50 transition-colors"
      >
        Discuss
      </Link>
    </div>
  );
}

export default function GamesPage() {
  const [league, setLeague] = useState("all");
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");

  const { data: nbaGames } = useSWR<NormalizedGame[]>("/api/sports/nba?range=270", fetcher);
  const { data: wcGames } = useSWR<NormalizedGame[]>("/api/sports/world-cup?range=270", fetcher);

  const [allGames, setAllGames] = useState<NormalizedGame[]>([]);

  useEffect(() => {
    const combined = [...(nbaGames ?? []), ...(wcGames ?? [])];
    setAllGames(combined);
  }, [nbaGames, wcGames]);

  const filtered = allGames
    .filter((g) => {
      if (league !== "all" && g.leagueId !== league) return false;
      if (status !== "all" && g.status !== status) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        if (!g.home.name.toLowerCase().includes(q) && !g.away.name.toLowerCase().includes(q)) {
          return false;
        }
      }
      return true;
    })
    .sort((a, b) => +new Date(b.startTime) - +new Date(a.startTime))
    .slice(0, 50);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="font-display font-extrabold text-3xl text-chalk">GAMES</h1>
        <p className="text-chalk-dim text-sm mt-1">Find games and join the conversation.</p>
      </div>

      <div className="flex flex-col gap-3 border border-court-line rounded-card bg-court-panel p-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search games or teams..."
          className="bg-court-bg border border-court-line rounded-card px-3 py-2 text-sm text-chalk"
        />
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={league}
            onChange={(e) => setLeague(e.target.value)}
            className="bg-court-bg border border-court-line rounded-card px-3 py-2 text-sm text-chalk flex-1"
          >
            {LEAGUES.map((l) => (
              <option key={l.id} value={l.id}>{l.label}</option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-court-bg border border-court-line rounded-card px-3 py-2 text-sm text-chalk flex-1"
          >
            {STATUSES.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
          <button
            onClick={() => {
              setLeague("all");
              setStatus("all");
              setSearch("");
            }}
            className="text-sm text-chalk-dim hover:text-signal-orange px-3 py-2 whitespace-nowrap"
          >
            Clear Filters
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {filtered.length === 0 && (
          <p className="text-chalk-dim text-sm">No games match your filters right now.</p>
        )}
        {filtered.map((g) => (
          <GameRow key={g.id} game={g} />
        ))}
      </div>
    </div>
  );
}
