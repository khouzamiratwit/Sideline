"use client";

import { useEffect, useState } from "react";

// Fast-path stand-in for real auth. Generates a random id + username on
// first visit, stores both in localStorage, and upserts a matching User
// row via /api/users so posts/comments/votes have a valid author. Swap
// this out for real Supabase session data after the practice presentation.
export function useDemoUser() {
  const [id, setId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    let storedId = window.localStorage.getItem("demo_user_id");
    let storedName = window.localStorage.getItem("demo_username");

    if (!storedId) {
      storedId = crypto.randomUUID();
      window.localStorage.setItem("demo_user_id", storedId);
    }
    if (!storedName) {
      storedName = `fan${Math.floor(Math.random() * 9000 + 1000)}`;
      window.localStorage.setItem("demo_username", storedName);
    }

    setId(storedId);
    setUsername(storedName);

    fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: storedId, username: storedName }),
    }).catch(() => {
      // Non-fatal for the demo -- worst case, posting fails until this
      // resolves on a later render/retry.
    });
  }, []);

  function updateUsername(next: string) {
    window.localStorage.setItem("demo_username", next);
    setUsername(next);
    if (id) {
      fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, username: next }),
      }).catch(() => {});
    }
  }

  return { id, username, setUsername: updateUsername };
}
