import { auth } from "@/auth";
import { EventFeed } from "@/components/posts-events/events/events-feed";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function EventsPage(){
    const session = await auth();
    const user = session?.user;
  
    if (!user) return <div>Unauthorized</div>;
  
    return (
      user.organization ?<div>
        <EventFeed user={user} showCreateOption={true} />
      </div>
      :
      <div className="flex flex-col mt-10 space-y-3 items-center">
          <p className="text-center text-lg font-semibold text-slate-600">Please Join an Organization to see its Events</p>
          <Link href={"/organization"} ><Button className="bg-blue-200 hover:bg-blue-300 text-blue-600 border border-blue-600 " size={"lg"}>Join an Organization</Button></Link>
      </div>
    );
}