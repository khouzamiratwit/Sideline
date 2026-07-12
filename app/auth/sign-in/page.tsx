"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendMagicLink() {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
  }

  return (
    <div className="max-w-sm mx-auto flex flex-col gap-4">
      <h1 className="font-display font-extrabold text-3xl text-chalk">SIGN IN</h1>
      {sent ? (
        <p className="text-chalk-dim text-sm">
          Check your email for a sign-in link.
        </p>
      ) : (
        <>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="bg-court-panel border border-court-line rounded-card p-2 text-chalk"
          />
          {error && <p className="text-signal-red text-sm">{error}</p>}
          <button
            onClick={sendMagicLink}
            className="bg-signal-orange text-court-bg font-semibold px-4 py-2 rounded-card"
          >
            Send magic link
          </button>
        </>
      )}
    </div>
  );
}
