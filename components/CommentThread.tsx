"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import useSWR from "swr";
import VoteButtons from "./VoteButtons";
import { FeedComment, CommentNode, buildCommentTree } from "@/types/comment";
import { useCurrentUser } from "@/lib/useCurrentUser";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function CommentItem({
  node,
  postId,
  depth,
  onPosted,
  userId,
}: {
  node: CommentNode;
  postId: string;
  depth: number;
  onPosted: () => void;
  userId: string | null;
}) {
  const [replying, setReplying] = useState(false);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submitReply() {
    if (!text.trim() || submitting || !userId) return;
    setSubmitting(true);
    try {
      await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, parentId: node.id, body: text, authorId: userId }),
      });
      setText("");
      setReplying(false);
      onPosted();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex gap-2" style={{ marginLeft: depth > 0 ? 16 : 0 }}>
      <VoteButtons
        targetType="comment"
        targetId={node.id}
        initialScore={node.score}
        initialUserVote={node.userVote}
      />
      <div className="flex-1 min-w-0 pb-2 border-l border-court-line pl-3">
        <div className="text-xs text-chalk-dim mb-0.5">
          <span className="font-semibold text-chalk">{node.author.username}</span>
          {" · "}
          {formatDistanceToNow(new Date(node.createdAt), { addSuffix: true })}
        </div>
        <p className="text-sm text-chalk">{node.body}</p>
        {userId ? (
          <button onClick={() => setReplying((r) => !r)} className="text-xs text-chalk-dim hover:text-signal-orange mt-1">
            Reply
          </button>
        ) : (
          <Link href="/auth/sign-in" className="text-xs text-chalk-dim hover:text-signal-orange mt-1 inline-block">
            Sign in to reply
          </Link>
        )}
        {replying && (
          <div className="mt-2 flex flex-col gap-2">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="bg-court-bg border border-court-line rounded-card p-2 text-sm text-chalk"
              rows={2}
              placeholder="Write a reply..."
            />
            <button
              onClick={submitReply}
              disabled={submitting}
              className="self-start text-xs bg-signal-orange text-court-bg font-semibold px-2 py-1 rounded-card disabled:opacity-50"
            >
              {submitting ? "Posting..." : "Post reply"}
            </button>
          </div>
        )}
        {node.children.length > 0 && (
          <div className="mt-2 flex flex-col gap-2">
            {node.children.map((child) => (
              <CommentItem key={child.id} node={child} postId={postId} depth={depth + 1} onPosted={onPosted} userId={userId} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CommentThread({ postId }: { postId: string }) {
  const { user } = useCurrentUser();
  const { data, isLoading, mutate } = useSWR<FeedComment[]>(`/api/comments?postId=${postId}`, fetcher);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submitTopLevel() {
    if (!newComment.trim() || submitting || !user) return;
    setSubmitting(true);
    try {
      await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, body: newComment, authorId: user.id }),
      });
      setNewComment("");
      mutate();
    } finally {
      setSubmitting(false);
    }
  }

  if (isLoading) return <p className="text-chalk-dim text-sm">Loading comments...</p>;

  const tree = buildCommentTree(data ?? []);

  return (
    <div className="flex flex-col gap-4 mt-6">
      {user ? (
        <div className="flex flex-col gap-2">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="bg-court-panel border border-court-line rounded-card p-3 text-sm text-chalk"
            rows={3}
            placeholder="Join the discussion..."
          />
          <button
            onClick={submitTopLevel}
            disabled={submitting}
            className="self-start text-sm bg-signal-orange text-court-bg font-semibold px-3 py-1.5 rounded-card disabled:opacity-50"
          >
            {submitting ? "Posting..." : "Comment"}
          </button>
        </div>
      ) : (
        <div className="border border-court-line rounded-card bg-court-panel p-4 text-center">
          <p className="text-chalk-dim text-sm mb-2">Sign in to join the discussion.</p>
          <Link
            href="/auth/sign-in"
            className="inline-block text-sm bg-signal-orange text-court-bg font-semibold px-3 py-1.5 rounded-card"
          >
            Sign in
          </Link>
        </div>
      )}
      <div className="flex flex-col gap-3">
        {tree.length === 0 && <p className="text-chalk-dim text-sm">No comments yet — start the conversation.</p>}
        {tree.map((node) => (
          <CommentItem key={node.id} node={node} postId={postId} depth={0} onPosted={() => mutate()} userId={user?.id ?? null} />
        ))}
      </div>
    </div>
  );
}
