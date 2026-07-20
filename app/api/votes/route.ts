import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { targetType, targetId, value, userId } = await req.json();

  if (!["post", "comment"].includes(targetType) || ![1, -1, 0].includes(value)) {
    return NextResponse.json({ error: "invalid vote payload" }, { status: 400 });
  }


  if (!userId) {
    return NextResponse.json({ error: "not authenticated" }, { status: 401 });
  }

  const whereClause =
    targetType === "post"
      ? { userId_postId: { userId, postId: targetId } }
      : { userId_commentId: { userId, commentId: targetId } };

  if (value === 0) {
    await prisma.vote.deleteMany({
      where: targetType === "post" ? { userId, postId: targetId } : { userId, commentId: targetId },
    });
    return NextResponse.json({ ok: true });
  }

  await prisma.vote.upsert({
    where: whereClause as any,
    update: { value },
    create: {
      userId,
      value,
      postId: targetType === "post" ? targetId : undefined,
      commentId: targetType === "comment" ? targetId : undefined,
    },
  });

  return NextResponse.json({ ok: true });
}
