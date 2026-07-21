import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    return NextResponse.json(null, { status: 401 });
  }

  const dbUser = await prisma.user.findUnique({ where: { id: data.user.id } });

  if (!dbUser) {
    return NextResponse.json(null, { status: 404 });
  }

  return NextResponse.json({
    id: dbUser.id,
    username: dbUser.username,
    avatarUrl: dbUser.avatarUrl,
  });
}

export async function PATCH(req: NextRequest) {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    return NextResponse.json({ error: "not authenticated" }, { status: 401 });
  }

  const { username } = await req.json();
  const trimmed = (username ?? "").trim();

  if (!trimmed || trimmed.length < 2 || trimmed.length > 20) {
    return NextResponse.json(
      { error: "Display name must be 2-20 characters" },
      { status: 400 }
    );
  }

  const taken = await prisma.user.findUnique({ where: { username: trimmed } });
  if (taken && taken.id !== data.user.id) {
    return NextResponse.json({ error: "That name is already taken" }, { status: 409 });
  }

  const updated = await prisma.user.update({
    where: { id: data.user.id },
    data: { username: trimmed },
  });

  return NextResponse.json({
    id: updated.id,
    username: updated.username,
    avatarUrl: updated.avatarUrl,
  });
}
