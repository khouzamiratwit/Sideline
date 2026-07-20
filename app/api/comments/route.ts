import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const postId = req.nextUrl.searchParams.get("postId");
  if (!postId) {
    return NextResponse.json({ error: "postId is required" }, { status: 400 });
  }

  const comments = await prisma.comment.findMany({
    where: { postId },
    orderBy: { createdAt: "asc" },
    include: {
      author: { select: { username: true, avatarUrl: true } },
      votes: true,
    },
  });

  const shaped = comments.map((c) => ({
    id: c.id,
    parentId: c.parentId,
    body: c.body,
    createdAt: c.createdAt.toISOString(),
    author: c.author,
    score: c.votes.reduce((sum, v) => sum + v.value, 0),
    userVote: 0,
  }));

  return NextResponse.json(shaped);
}

export async function POST(req: NextRequest) {
  const { postId, body, authorId, parentId } = await req.json();

  if (!postId || !body || !authorId) {
    return NextResponse.json(
      { error: "postId, body, and authorId are required" },
      { status: 400 }
    );
  }

  const comment = await prisma.comment.create({
    data: { postId, body, authorId, parentId: parentId ?? null },
  });

  return NextResponse.json(comment, { status: 201 });
}
