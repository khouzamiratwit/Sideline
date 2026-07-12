"use client";

import { useState } from "react";
import clsx from "clsx";
import { useDemoUser } from "@/lib/useDemoUser";

interface VoteButtonsProps {
  targetType: "post" | "comment";
  targetId: string;
  initialScore: number;
  initialUserVote?: 1 | -1 | 0;
}

export default function VoteButtons({
  targetType,
  targetId,
  initialScore,
  initialUserVote = 0,
}: VoteButtonsProps) {
  const { id: userId } = useDemoUser();
  const [score, setScore] = useState(initialScore);
  const [userVote, setUserVote] = useState<1 | -1 | 0>(initialUserVote);
  const [pending, setPending] = useState(false);

  async function cast(value: 1 | -1) {
    if (pending || !userId) return;
    const next = userVote === value ? 0 : value;
    const delta = next - userVote;
    setScore((s) => s + delta);
    setUserVote(next);
    setPending(true);
    try {
      const res = await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetType, targetId, value: next, userId }),
      });
      if (!res.ok) throw new Error("vote failed");
    } catch {
      setScore((s) => s - delta);
      setUserVote(userVote);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-0.5 w-8">
      <button
        aria-label="Upvote"
        onClick={() => cast(1)}
        className={clsx(
          "transition-colors",
          userVote === 1 ? "text-signal-orange" : "text-chalk-dim hover:text-signal-orange"
        )}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 3l6 7H2z" />
        </svg>
      </button>
      <span className="font-mono text-sm font-semibold text-chalk">{score}</span>
      <button
        aria-label="Downvote"
        onClick={() => cast(-1)}
        className={clsx(
          "transition-colors",
          userVote === -1 ? "text-signal-blue" : "text-chalk-dim hover:text-signal-blue"
        )}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 13L2 6h12z" />
        </svg>
      </button>
    </div>
  );
}
