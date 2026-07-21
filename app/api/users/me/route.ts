import { NextResponse } from "next/server";
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
