"use client";

import { useEffect, useState } from "react";


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
