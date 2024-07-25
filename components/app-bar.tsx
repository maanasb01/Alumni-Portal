import { auth, signOut } from "@/auth";
import Link from "next/link";
import { Button } from "./ui/button";
import { DEFAULT_LOGOUT_REDIRECT } from "@/routes";

export async function AppBar() {
  const session = await auth();
  return (
    <>
      <header className="text-gray-600 border-b-2 border-b-gray-300 body-font bg-gradient-to-r from-slate-200 to-gray-100">
        <div className="container mx-auto flex flex-wrap p-5 flex-row items-center">
          <Link
            className="flex title-font font-medium items-center text-gray-900 mb-0"
            href={"/"}
          >
            <span className="ml-3 text-xl">Alumni Portal</span>
          </Link>

          {session?.user ? (
            <form
              className="ml-auto mt-0"
              action={async () => {
                "use server";
                await signOut({redirectTo:DEFAULT_LOGOUT_REDIRECT });
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
