import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import VoteButtons from "./VoteButtons";
import { FeedPost } from "@/types/post";

export default function PostCard({ post }: { post: FeedPost }) {
  return (
    <article className="flex gap-3 bg-court-panel border border-court-line rounded-card p-3 hover:border-signal-orange/40 transition-colors">
      <VoteButtons
        targetType="post"
        targetId={post.id}
        initialScore={post.score}
        initialUserVote={post.userVote}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-xs text-chalk-dim mb-1">
          <Link href={`/league/${post.league.id}`} className="font-semibold text-signal-orange hover:underline">
            {post.league.name}
          </Link>
          {post.team && <span>· {post.team.name}</span>}
          <span>· posted by {post.author.username}</span>
          <span>· {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
        </div>
        <Link href={`/post/${post.id}`}>
          <h2 className="font-display font-bold text-xl text-chalk leading-snug hover:text-signal-orange transition-colors">
            {post.title}
          </h2>
        </Link>
        {post.body && (
          <p className="text-sm text-chalk-dim mt-1 line-clamp-2">{post.body}</p>
        )}
        <div className="mt-2">
          <Link
            href={`/post/${post.id}`}
            className="text-xs text-chalk-dim hover:text-signal-blue transition-colors"
          >
            {post.commentCount} comments
          </Link>
        </div>
      </div>
    </article>
  );
}
