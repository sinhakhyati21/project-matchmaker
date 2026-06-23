"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      className="bg-red-500 text-white px-4 py-2 rounded-lg"
      onClick={() => signOut()}
    >
      Sign Out
    </button>
  );
}