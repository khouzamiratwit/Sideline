import PostCard from "@/components/PostCard";
import { prisma } from "@/lib/prisma";
import { FeedPost } from "@/types/post";

async function getAllPosts(): Promise<FeedPost[]> {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
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

export default async function DiscussionsPage() {
  const posts = await getAllPosts();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between">
        <h1 className="font-display font-extrabold text-3xl text-chalk">ALL DISCUSSIONS</h1>
        
          href="/post/new"
          className="text-sm bg-signal-orange text-court-bg font-semibold px-3 py-1.5 rounded-card hover:opacity-90 transition-opacity"
        >
          Start a thread
        </a>
      </div>
      <div className="flex flex-col gap-3">
        {posts.length === 0 && (
          <p className="text-chalk-dim text-sm">No threads yet — be the first to start a discussion.</p>
        )}
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
