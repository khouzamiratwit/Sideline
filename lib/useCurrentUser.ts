"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

export interface CurrentUser {
  id: string;
  username: string;
  avatarUrl: string | null;
}

export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    const res = await fetch("/api/users/me");
    if (res.ok) {
      setUser(await res.json());
    } else {
      setUser(null);
    }
  }

  useEffect(() => {
    const supabase = createClient();

    async function loadUser(authUserId: string | undefined) {
      if (!authUserId) {
        setUser(null);
        setLoading(false);
        return;
      }
      await refresh();
      setLoading(false);
    }

    supabase.auth.getUser().then(({ data }) => loadUser(data.user?.id));

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      loadUser(session?.user?.id);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = "/";
  }

  async function updateUsername(newName: string): Promise<{ ok: boolean; error?: string }> {
    const res = await fetch("/api/users/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: newName }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { ok: false, error: body.error ?? "Couldn't update name" };
    }
    const updated = await res.json();
    setUser(updated);
    return { ok: true };
  }

  return { user, loading, signOut, updateUsername };
}
