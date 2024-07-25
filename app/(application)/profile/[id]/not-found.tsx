import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaRegFaceFrown } from "react-icons/fa6";

export default function NotFound() {
  return (
    <main className="flex h-full flex-col items-center justify-center gap-2">
      <FaRegFaceFrown size={30} className=" text-gray-400" />
      <h2 className="text-xl font-semibold">404 Not Found</h2>
      <p>Could not find the requested user.</p>
      <Link
        href="/search"
        className=""
      >
        <Button
          className="bg-blue-500 hover:bg-blue-600 transition-colors"
        >
          Go Back
        </Button>
      </Link>
    </main>
  );
}
