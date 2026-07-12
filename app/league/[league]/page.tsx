import PostCard from "@/components/PostCard";
import { FeedPost } from "@/types/post";
import { getScoreboard } from "@/lib/sports-api";
import { NormalizedGame } from "@/types/sports";

const LEAGUE_NAMES: Record<string, string> = {
  nba: "NBA",
  "world-cup": "World Cup",
};

async function getFeed(leagueId: string): Promise<FeedPost[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/api/posts?league=${leagueId}`,
    { cache: "no-store" }
  );
  if (!res.ok) return [];
  return res.json();
}

export default async function LeaguePage({ params }: { params: { league: string } }) {
  const leagueId = params.league;
  const leagueName = LEAGUE_NAMES[leagueId] ?? leagueId;

  const [posts, games] = await Promise.all([
    getFeed(leagueId),
    getScoreboard(leagueId).catch(() => [] as NormalizedGame[]),
  ]);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-display font-extrabold text-3xl text-chalk">{leagueName}</h1>

      {games.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {games.map((g) => (
            <div
              key={g.id}
              className="bg-court-panel border border-court-line rounded-card p-3 flex items-center justify-between"
            >
              <div className="font-mono text-sm text-chalk">
                {g.away.abbreviation} {g.away.score ?? "-"} @ {g.home.abbreviation} {g.home.score ?? "-"}
              </div>
              <span className="text-xs text-chalk-dim">{g.period}</span>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-3">
        {posts.length === 0 && (
          <p className="text-chalk-dim text-sm">No threads in {leagueName} yet.</p>
        )}
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
