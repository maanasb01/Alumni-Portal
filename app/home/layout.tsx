import { PostEventsNav } from "@/components/posts/postevents-nav";

export default function HomeFeedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="px-2 pb-4">
      <PostEventsNav />

      {children}
    </div>
  );
}
