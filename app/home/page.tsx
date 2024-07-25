import { auth } from "@/auth";
import { PostFeed } from "@/components/posts-events/posts/posts-feed";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
  const session = await auth();
  const user = session?.user;

  if (!user) return <div>Unauthorized</div>;

  return (
    user.organization ?<div>
      <PostFeed user={user} />
    </div>
    :
    <div className="flex flex-col mt-10 space-y-3 items-center">
          <p className="text-center text-lg font-semibold text-slate-600">Please Join an Organization to see its Posts</p>
          <Link href={"/organization"} ><Button className="bg-blue-200 hover:bg-blue-300 text-blue-600 border border-blue-600 " size={"lg"}>Join an Organization</Button></Link>
      </div>
  );
}
