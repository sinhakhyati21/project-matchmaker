import Link from "next/link";

import { auth } from "../auth";
import SignOutButton from "./SignOutButton";

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className="border-b px-6 py-4 flex justify-between items-center">
      <Link href="/" className="text-2xl font-bold">
        Project Matchmaker
      </Link>

      <div className="flex gap-4 items-center">
        <Link href="/projects">Projects</Link>

        {session && (
          <>
            <Link href="/create-project">Create Project</Link>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/profile">Profile</Link>
          </>
        )}

        {session ? (
          <SignOutButton />
        ) : (
          <Link href="/signin">Sign In</Link>
        )}
      </div>
    </nav>
  );
}