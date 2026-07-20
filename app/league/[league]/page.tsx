import PostCard from "@/components/PostCard";
import { FeedPost } from "@/types/post";
import { getScoreboard } from "@/lib/sports-api";
import { NormalizedGame } from "@/types/sports";
import { prisma } from "@/lib/prisma";

const LEAGUE_NAMES: Record<string, string> = {
  nba: "NBA",
  "world-cup": "World Cup",
};


async function getFeed(leagueId: string): Promise<FeedPost[]> {
  const posts = await prisma.post.findMany({
    where: { leagueId },
    orderBy: { createdAt: "desc" },
    take: 25,
    include: {
      author: { select: { username: true, avatarUrl: true } },
      league: { select: { id: true, name: true } },
      team: { select: { id: true, name: true, abbreviation: true } },
      votes: true,
      comments: { select: { id: true } },
    },
  });

  return posts.map((p) => ({
    id: p.id,
    title: p.title,
    body: p.body,
    createdAt: p.createdAt.toISOString(),
    author: p.author,
    league: p.league,
    team: p.team,
    score: p.votes.reduce((sum, v) => sum + v.value, 0),
    commentCount: p.comments.length,
    userVote: 0 as 0, 
  }));
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
