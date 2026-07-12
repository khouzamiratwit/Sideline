import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import CommentThread from "@/components/CommentThread";
import VoteButtons from "@/components/VoteButtons";
import Link from "next/link";

async function getPost(id: string) {
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: { select: { username: true } },
      league: { select: { id: true, name: true } },
      team: { select: { name: true } },
      votes: true,
    },
  });
  return post;
}

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await getPost(params.id);
  if (!post) notFound();

  const score = post.votes.reduce((sum, v) => sum + v.value, 0);

  return (
    <div>
      <div className="flex gap-3 bg-court-panel border border-court-line rounded-card p-4">
        <VoteButtons targetType="post" targetId={post.id} initialScore={score} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-xs text-chalk-dim mb-1">
            <Link href={`/league/${post.league.id}`} className="font-semibold text-signal-orange hover:underline">
              {post.league.name}
            </Link>
            {post.team && <span>· {post.team.name}</span>}
            <span>· posted by {post.author.username}</span>
            <span>· {formatDistanceToNow(post.createdAt, { addSuffix: true })}</span>
          </div>
          <h1 className="font-display font-bold text-2xl text-chalk leading-snug">{post.title}</h1>
          {post.body && <p className="text-sm text-chalk mt-2 whitespace-pre-wrap">{post.body}</p>}
        </div>
      </div>
      <CommentThread postId={post.id} />
    </div>
  );
}
