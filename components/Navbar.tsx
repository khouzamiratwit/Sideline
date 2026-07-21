"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCurrentUser } from "@/lib/useCurrentUser";

export default function Navbar() {
  const { user, loading, signOut, updateUsername } = useCurrentUser();
  const pathname = usePathname();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);

  function navLinkClass(href: string) {
    const isActive = href === "/" ? pathname === "/" : pathname?.startsWith(href);
    return isActive
      ? "text-signal-orange font-semibold transition-colors"
      : "text-chalk-dim hover:text-signal-orange transition-colors";
  }

  async function submitName() {
    if (!draft.trim()) return;
    const result = await updateUsername(draft.trim());
    if (result.ok) {
      setEditing(false);
      setError(null);
    } else {
      setError(result.error ?? "Couldn't update name");
    }
  }

  return (
    <header className="border-b border-court-line bg-court-panel">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-display font-extrabold text-2xl tracking-tight text-chalk">
          SIDELINE
        </Link>
        <nav className="flex items-center gap-5 text-sm">
          <Link href="/" className={navLinkClass("/")}>
            Home
          </Link>
          <Link href="/games" className={navLinkClass("/games")}>
            Games
          </Link>
          <Link href="/leagues" className={navLinkClass("/leagues")}>
            Leagues
          </Link>
          <Link
            href="/post/new"
            className="text-xs bg-signal-orange text-court-bg font-semibold px-3 py-1.5 rounded-card hover:opacity-90 transition-opacity"
          >
            New Thread
          </Link>
          {loading ? null : user ? (
            <div className="flex items-center gap-2">
              {editing ? (
                <div className="flex flex-col items-end gap-1">
                  <input
                    autoFocus
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") submitName();
                      if (e.key === "Escape") setEditing(false);
                    }}
                    className="bg-court-bg border border-court-line rounded-card px-2 py-1 text-xs text-chalk w-28"
                    placeholder="display name"
                  />
                  {error && <span className="text-signal-red text-xs">{error}</span>}
                </div>
              ) : (
                <button
                  onClick={() => {
                    setDraft(user.username);
                    setEditing(true);
                    setError(null);
                  }}
                  className="text-chalk-dim hover:text-signal-orange transition-colors text-xs"
                  title="Click to change your display name"
                >
                  {user.username}
                </button>
              )}
              <button
                onClick={signOut}
                className="text-chalk-dim hover:text-signal-orange transition-colors"
                title="Sign out"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <path d="M16 17l5-5-5-5" />
                  <path d="M21 12H9" />
                </svg>
              </button>
            </div>
          ) : (
            <Link
              href="/auth/sign-in"
              className="text-xs border border-court-line text-chalk px-3 py-1.5 rounded-card hover:border-signal-orange/50 transition-colors"
            >
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
