import { auth } from "@/auth";
import { PostFeed } from "@/components/posts/posts-feed";

export default async function Home() {
  const session = await auth();
  const user = session?.user;

  if (!user) return <div>Unauthorized</div>;

  return (
    <div>
      <PostFeed user={user} />
    </div>
  );
}
