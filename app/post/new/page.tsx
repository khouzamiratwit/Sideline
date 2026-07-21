"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCurrentUser } from "@/lib/useCurrentUser";

const LEAGUES = [
  { id: "nba", label: "NBA" },
  { id: "world-cup", label: "World Cup" },
];

export default function NewPostPage() {
  const router = useRouter();
  const { user, loading } = useCurrentUser();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [leagueId, setLeagueId] = useState(LEAGUES[0].id);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (!title.trim()) {
      setError("Give your thread a title.");
      return;
    }
    if (!user) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, postBody: body, leagueId, authorId: user.id }),
      });
      if (!res.ok) throw new Error();
      const post = await res.json();
      router.push(`/post/${post.id}`);
    } catch {
      setError("Couldn't create the thread. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return null;

  if (!user) {
    return (
      <div className="max-w-sm mx-auto flex flex-col gap-3 items-center text-center py-12">
        <h1 className="font-display font-extrabold text-3xl text-chalk">START A THREAD</h1>
        <p className="text-chalk-dim text-sm">Sign in to start a thread.</p>
        <Link
          href="/auth/sign-in"
          className="bg-signal-orange text-court-bg font-semibold px-4 py-2 rounded-card"
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 max-w-xl">
      <h1 className="font-display font-extrabold text-3xl text-chalk">START A THREAD</h1>

      <label className="flex flex-col gap-1 text-sm text-chalk-dim">
        League
        <select
          value={leagueId}
          onChange={(e) => setLeagueId(e.target.value)}
          className="bg-court-panel border border-court-line rounded-card p-2 text-chalk"
        >
          {LEAGUES.map((l) => (
            <option key={l.id} value={l.id}>
              {l.label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm text-chalk-dim">
        Title
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-court-panel border border-court-line rounded-card p-2 text-chalk"
          placeholder="What's the take?"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-chalk-dim">
        Body (optional)
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={6}
          className="bg-court-panel border border-court-line rounded-card p-2 text-chalk"
          placeholder="Make your case..."
        />
      </label>

      {error && <p className="text-signal-red text-sm">{error}</p>}

      <button
        onClick={submit}
        disabled={submitting}
        className="self-start bg-signal-orange text-court-bg font-semibold px-4 py-2 rounded-card disabled:opacity-50"
      >
        {submitting ? "Posting..." : "Post thread"}
      </button>
    </div>
  );
}
