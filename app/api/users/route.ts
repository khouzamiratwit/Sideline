import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Fast-path stand-in for real auth: creates/updates a User row keyed by a
// client-generated id, so posts/comments/votes have a valid foreign key
// tonight without needing full Supabase session wiring. Swap for real
// Supabase auth after the practice presentation.
export async function POST(req: NextRequest) {
  const { id, username } = await req.json();
  if (!id || !username) {
    return NextResponse.json({ error: "id and username required" }, { status: 400 });
  }

  const user = await prisma.user.upsert({
    where: { id },
    update: { username },
    create: { id, username },
  });

  return NextResponse.json(user);
}
