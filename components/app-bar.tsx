import { auth, signOut } from "@/auth";
import Link from "next/link";
import { Button } from "./ui/button";

export async function AppBar() {
  const session = await auth();
  return (
    <>
      <header className="text-gray-600 border-b-2 border-b-gray-300 body-font">
        <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
          <Link
            className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0"
            href={"/"}
          >
            <span className="ml-3 text-xl">Alumni Portal</span>
          </Link>
          {/* <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
            <a className="mr-5 hover:text-gray-900">First Link</a>
            <a className="mr-5 hover:text-gray-900">Second Link</a>
            <a className="mr-5 hover:text-gray-900">Third Link</a>
            <a className="mr-5 hover:text-gray-900">Fourth Link</a>
          </nav> */}
          {/* <button className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0 md:ml-auto">
            Button
            <svg
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              className="w-4 h-4 ml-1"
              viewBox="0 0 24 24"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button> */}

          {session?.user ? (
            <form
              className="md:ml-auto md:mt-0 mt-4"
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <Button size={"sm"} variant={"destructive"}>
                SignOut
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  className="w-4 h-4 ml-1"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Button>
            </form>
          ) : (
            <div className="md:ml-auto md:mt-0 mt-4 flex space-x-2">
              <Link href={"/login"}>
                <Button size={"sm"}>Login</Button>
              </Link>
              <Link href={"/register"}>
                <Button size={"sm"}>Register</Button>
              </Link>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
