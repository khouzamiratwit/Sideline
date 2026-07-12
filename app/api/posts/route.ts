import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const leagueId = req.nextUrl.searchParams.get("league") ?? undefined;

  const posts = await prisma.post.findMany({
    where: leagueId ? { leagueId } : undefined,
    orderBy: { createdAt: "desc" },
    take: 25,
    include: {
      author: { select: { username: true, avatarUrl: true } },
      league: { select: { id: true, name: true } },
      team: { select: { id: true, name: true, abbreviation: true } },
      votes: true,
      comments: { select: { id: true } },
    },
  });

  const shaped = posts.map((p) => ({
    id: p.id,
    title: p.title,
    body: p.body,
    createdAt: p.createdAt.toISOString(),
    author: p.author,
    league: p.league,
    team: p.team,
    score: p.votes.reduce((sum, v) => sum + v.value, 0),
    commentCount: p.comments.length,
    userVote: 0, // TODO: fill from the authenticated user's own vote once auth is wired in
  }));

  return NextResponse.json(shaped);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, postBody, leagueId, teamId, authorId } = body;

  if (!title || !leagueId || !authorId) {
    return NextResponse.json(
      { error: "title, leagueId, and authorId are required" },
      { status: 400 }
    );
  }

  const post = await prisma.post.create({
    data: { title, body: postBody, leagueId, teamId, authorId },
  });

  return NextResponse.json(post, { status: 201 });
}
