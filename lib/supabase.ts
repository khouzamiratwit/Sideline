import { createBrowserClient } from "@supabase/ssr";

// Client-side Supabase instance -- used in client components for auth
// (sign in/out, session) and any direct-from-browser reads you allow
// under RLS policies. Writes to posts/comments/votes should go through
// our own API routes (app/api/*) so we can enforce app-level rules.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
