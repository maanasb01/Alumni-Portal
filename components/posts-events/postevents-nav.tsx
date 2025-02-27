"use client";


import Link from "next/link";
import { usePathname } from "next/navigation";

export function PostEventsNav() {
    const path = usePathname();
    
  return (
    <div className="flex justify-center items-center space-x-4 border-b-2 border-b-slate-400 bg-gradient-to-r from-slate-100 to-slate-300 py-4 sticky top-0 z-10">
      <Link className={`${path==="/home" ? "text-slate-700 font-semibold":"text-slate-600"}`} href="/home">Posts</Link>
      <div className=" bg-gray-300 h-6 w-[1px]"/>
      <Link className={`${path==="/home/events" ? "text-slate-700 font-semibold":"text-slate-600"}`} href={"/home/events"}>Events</Link>
    </div>
  );
}
