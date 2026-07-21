"use client";

import Link from "next/link";
import { useState } from "react";
import { useDemoUser } from "@/lib/useDemoUser";

export default function Navbar() {
  const { username, setUsername } = useDemoUser();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

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
          {editing ? (
            <input
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && draft.trim()) {
                  setUsername(draft.trim());
                  setEditing(false);
                }
              }}
              className="bg-court-bg border border-court-line rounded-card px-2 py-1 text-xs text-chalk w-24"
              placeholder="username"
            />
          ) : (
            <button
              onClick={() => {
                setDraft(username ?? "");
                setEditing(true);
              }}
              className="flex items-center gap-1.5 text-chalk-dim hover:text-signal-orange transition-colors"
              title="Click to change your display name"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
              <span className="text-xs">{username ?? "..."}</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
