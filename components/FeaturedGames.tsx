import Link from "next/link";
import { getAllScoreboards } from "@/lib/sports-api";
import { NormalizedGame } from "@/types/sports";

const LEAGUE_LABELS: Record<string, string> = {
  nba: "NBA",
  "world-cup": "World Cup",
};

function GameCard({ game }: { game: NormalizedGame }) {
  return (
    <div className="border border-court-line rounded-card p-4 bg-court-panel flex flex-col items-center text-center gap-1">
      <div className="flex items-center justify-center gap-3 w-full">
        <div className="flex flex-col items-center gap-1 flex-1">
          <div className="w-10 h-10 rounded-full bg-court-bg border border-court-line" />
          <span className="text-xs font-semibold text-chalk">{game.away.abbreviation}</span>
        </div>
        <span className="text-chalk-dim text-xs">vs</span>
        <div className="flex flex-col items-center gap-1 flex-1">
          <div className="w-10 h-10 rounded-full bg-court-bg border border-court-line" />
          <span className="text-xs font-semibold text-chalk">{game.home.abbreviation}</span>
        </div>
      </div>
      <div className="text-xs text-chalk-dim mt-2">
        {game.status === "final" ? "Final" : game.period ?? "Today"}
      </div>
      <div className="text-xs text-signal-orange">{LEAGUE_LABELS[game.leagueId] ?? game.leagueId}</div>
      <Link
        href={`/league/${game.leagueId}`}
        className="mt-2 w-full text-center text-xs bg-court-bg border border-court-line rounded-card py-1.5 text-chalk hover:border-signal-orange/50 transition-colors"
      >
        Discuss
      </Link>
    </div>
  );
}

export default async function FeaturedGames() {
  let games: NormalizedGame[] = [];
  try {
    games = await getAllScoreboards();
  } catch {
    games = [];
  }
  const featured = games.slice(0, 4);

  return (
    <section className="py-6">
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="font-display font-bold text-xl text-chalk">FEATURED GAMES</h2>
        <Link href="/games" className="text-xs text-chalk-dim hover:text-signal-orange">
          View all games →
        </Link>
      </div>
      {featured.length === 0 ? (
        <p className="text-chalk-dim text-sm">No games today — check back soon.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {featured.map((g) => (
            <GameCard key={g.id} game={g} />
          ))}
        </div>
      )}
    </section>
  );
}
