"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostFeed } from "./posts/posts-feed";
import { SessionUser } from "@/types/user";
import { EventFeed } from "./events/events-feed";

export function ProfilePostsEvents({
  user,
  showCreateOption,
  showOnlyUsers,
}: {
  user: SessionUser;
  showCreateOption: boolean;
  showOnlyUsers?: boolean;
}) {
  return (
    <Tabs defaultValue="posts" className="">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="posts">Posts</TabsTrigger>
        <TabsTrigger value="events">Events</TabsTrigger>
      </TabsList>
      <TabsContent value="posts">
        <PostFeed
          showCreateOption={showCreateOption}
          showOnlyUsers={showOnlyUsers}
          user={user}
        />
      </TabsContent>
      <TabsContent value="events">
        <EventFeed
          showCreateOption={showCreateOption}
          showOnlyUsers={showOnlyUsers}
          user={user}
        />
      </TabsContent>
    </Tabs>
  );
}
