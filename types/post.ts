import { Post } from "@prisma/client";

export type FeedPostType = Post & {
  organization: { name: string };
  author: { name: string; image: string };
};
