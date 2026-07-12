import Link from "next/link";
import { prisma } from "@/lib/prisma";

const LEAGUE_LABELS: Record<string, string> = {
  nba: "NBA",
  "world-cup": "World Cup",
};

async function getTrending() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
    include: {
      author: { select: { username: true } },
      league: { select: { id: true, name: true } },
      votes: true,
      comments: { select: { id: true } },
    },
  });

  return posts
    .map((p) => ({
      id: p.id,
      title: p.title,
      leagueId: p.league.id,
      authorName: p.author.username,
      createdAt: p.createdAt,
      score: p.votes.reduce((sum, v) => sum + v.value, 0),
      commentCount: p.comments.length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

export default async function TrendingDiscussions() {
  const trending = await getTrending();

  return (
    <section className="py-6 border-t border-court-line">
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="font-display font-bold text-xl text-chalk">TRENDING DISCUSSIONS</h2>
        <Link href="/" className="text-xs text-chalk-dim hover:text-signal-orange">
          View all discussions →
        </Link>
      </div>
      {trending.length === 0 ? (
        <p className="text-chalk-dim text-sm">No discussions yet — start the first one.</p>
      ) : (
        <div className="flex flex-col divide-y divide-court-line border border-court-line rounded-card bg-court-panel">
          {trending.map((post) => (
            <Link
              key={post.id}
              href={`/post/${post.id}`}
              className="flex items-center justify-between px-4 py-3 hover:bg-court-bg/40 transition-colors"
            >
              <div>
                <p className="text-sm text-chalk font-medium">{post.title}</p>
                <p className="text-xs text-chalk-dim mt-0.5">
                  <span className="text-signal-orange font-semibold">{LEAGUE_LABELS[post.leagueId] ?? post.leagueId}</span>
                  {" · posted by "}
                  {post.authorName}
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs text-chalk-dim shrink-0 ml-4">
                <span>{post.commentCount} 💬</span>
                <span>{post.score} ▲</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
