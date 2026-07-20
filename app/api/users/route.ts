import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


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
