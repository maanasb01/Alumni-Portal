"use client";

import { FcGoogle } from "react-icons/fc";
import { Button } from "../ui/button";
import { signIn } from "next-auth/react";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export function Social() {
  function handleGoogleSignIn() {
    signIn("google", {
      callbackUrl: DEFAULT_LOGIN_REDIRECT,
    });
  }



  return (
    <div className="flex items-center w-full">
      <Button
        onClick={handleGoogleSignIn}
        size="lg"
        className="w-full"
        variant="outline"
      >
        <FcGoogle className="h-7 w-7" />
      </Button>
    </div>
  );
}
