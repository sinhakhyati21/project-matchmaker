import { auth } from "../auth";
import SignOutButton from "./SignOutButton";
import Link from "next/link";

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className="border-b p-4 flex justify-between">
      <h1 className="text-2xl font-bold">
        Project Matchmaker
      </h1>

      {session ? (
        <SignOutButton />
      ) : (
        <Link href="/signin">
          Sign In
        </Link>
      )}
    </nav>
  );
}