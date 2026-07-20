import { getAllScoreboards } from "@/lib/sports-api";
import { NormalizedGame } from "@/types/sports";
import Link from "next/link";

function StatusDot({ status }: { status: NormalizedGame["status"] }) {
  if (status === "live") {
    return <span className="w-1.5 h-1.5 rounded-full bg-signal-green animate-pulse inline-block" />;
  }
  return <span className="w-1.5 h-1.5 rounded-full bg-chalk-dim inline-block" />;
}

function TickerGame({ game }: { game: NormalizedGame }) {
  return (
    <Link
      href={`/league/${game.leagueId}`}
      className="flex items-center gap-2 px-4 border-r border-court-line shrink-0 hover:bg-court-panel transition-colors"
    >
      <StatusDot status={game.status} />
      <span className="font-mono text-sm text-chalk-dim">{game.away.abbreviation}</span>
      <span className="font-mono text-sm font-semibold text-chalk">{game.away.score ?? "-"}</span>
      <span className="text-chalk-dim text-xs">@</span>
      <span className="font-mono text-sm text-chalk-dim">{game.home.abbreviation}</span>
      <span className="font-mono text-sm font-semibold text-chalk">{game.home.score ?? "-"}</span>
      <span className="text-xs text-chalk-dim ml-1">{game.period}</span>
    </Link>
  );
}


export default async function ScoreboardTicker() {
  let games: NormalizedGame[] = [];
  try {
    games = await getAllScoreboards();
  } catch {
 
    return null;
  }

  if (games.length === 0) {
    return (
      <div className="bg-court-bg border-b border-court-line h-10 flex items-center px-4">
        <span className="text-chalk-dim text-xs font-mono">No games today</span>
      </div>
    );
  }


  const doubled = [...games, ...games];

  return (
    <div className="bg-court-bg border-b border-court-line h-10 overflow-hidden relative">
      <div className="ticker-track flex items-center h-full w-max">
        {doubled.map((g, i) => (
          <TickerGame key={`${g.id}-${i}`} game={g} />
        ))}
      </div>
    </div>
  );
}
