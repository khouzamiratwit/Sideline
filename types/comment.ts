export interface FeedComment {
  id: string;
  parentId: string | null;
  body: string;
  createdAt: string;
  author: { username: string; avatarUrl: string | null };
  score: number;
  userVote: 1 | -1 | 0;
}

export interface CommentNode extends FeedComment {
  children: CommentNode[];
}

export function buildCommentTree(flat: FeedComment[]): CommentNode[] {
  const byId = new Map<string, CommentNode>();
  flat.forEach((c) => byId.set(c.id, { ...c, children: [] }));

  const roots: CommentNode[] = [];
  byId.forEach((node) => {
    if (node.parentId && byId.has(node.parentId)) {
      byId.get(node.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  });
  return roots;
}
