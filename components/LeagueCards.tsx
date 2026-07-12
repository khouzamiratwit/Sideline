import Link from "next/link";

const LEAGUES = [
  {
    id: "nba",
    name: "NBA",
    blurb: "News, game stats, and discussions from around the league.",
    cta: "Explore NBA",
  },
  {
    id: "world-cup",
    name: "World Cup",
    blurb: "Follow your favorite clubs and join the discussion all season long.",
    cta: "Explore World Cup",
  },
];

export default function LeagueCards({ hideHeader = false }: { hideHeader?: boolean }) {
  return (
    <section className={hideHeader ? "" : "py-6 border-t border-court-line"}>
      {!hideHeader && (
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="font-display font-bold text-xl text-chalk">LEAGUES</h2>
          <Link href="/leagues" className="text-xs text-chalk-dim hover:text-signal-orange">
            View all leagues →
          </Link>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {LEAGUES.map((l) => (
          <div key={l.id} className="border border-court-line rounded-card bg-court-panel p-4 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-court-bg border border-court-line shrink-0" />
            <div className="flex-1">
              <div className="font-display font-bold text-lg text-chalk">{l.name}</div>
              <p className="text-xs text-chalk-dim mt-0.5">{l.blurb}</p>
              <Link
                href={`/league/${l.id}`}
                className="inline-block mt-2 text-xs bg-signal-orange text-court-bg font-semibold px-3 py-1.5 rounded-card hover:opacity-90 transition-opacity"
              >
                {l.cta}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
