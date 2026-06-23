"use client";

import { signIn } from "next-auth/react";

export default function SignInButton() {
  return (
    <button
      className="bg-black text-white px-4 py-2 rounded-lg"
      onClick={() => signIn("github")}
    >
      Sign In with GitHub
    </button>
  );
}