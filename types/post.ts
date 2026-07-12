export interface FeedPost {
  id: string;
  title: string;
  body: string | null;
  createdAt: string;
  author: { username: string; avatarUrl: string | null };
  league: { id: string; name: string };
  team: { id: string; name: string; abbreviation: string | null } | null;
  score: number;
  commentCount: number;
  userVote: 1 | -1 | 0;
}
