"use client";

import { signIn } from "next-auth/react";

export default function SignInButton() {
  return (
    <button
      onClick={() => signIn("github", { callbackUrl: "/" })}
      className="bg-black text-white px-4 py-2 rounded-lg"
    >
      Sign In with GitHub
    </button>
  );
}