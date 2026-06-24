import Link from "next/link";
import { auth } from "../auth";
import SignOutButton from "./SignOutButton";
import { connectDB } from "../lib/db";
import Invitation from "../models/Invitation.model";

export default async function Navbar() {
  const session = await auth();

  let pendingInvitations = 0;
  if (session) {
    await connectDB();
    pendingInvitations = await Invitation.countDocuments({
      receiver: session.user.id,
      status: "PENDING",
    });
  }

  return (
    <nav
      style={{
        background: "rgba(15,15,16,0.8)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)",
        padding: "0 24px",
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        style={{
          fontSize: 18,
          fontWeight: 800,
          color: "var(--text-primary)",
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span
          style={{
            background: "#6366f1",
            color: "white",
            width: 28,
            height: 28,
            borderRadius: 8,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            fontWeight: 800,
          }}
        >
          PM
        </span>
        <span>Project Matchmaker</span>
      </Link>

      {/* Nav Links */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Link
          href="/projects"
          style={{
            color: "var(--text-muted)",
            textDecoration: "none",
            fontSize: 14,
            fontWeight: 500,
            padding: "6px 12px",
            borderRadius: 8,
          }}
        >
          Projects
        </Link>

        {session && (
          <>
            <Link
              href="/create-project"
              style={{
                color: "var(--text-muted)",
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 500,
                padding: "6px 12px",
                borderRadius: 8,
              }}
            >
              Create
            </Link>
            <Link
              href="/dashboard"
              style={{
                color: "var(--text-muted)",
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 500,
                padding: "6px 12px",
                borderRadius: 8,
              }}
            >
              Dashboard
            </Link>
            <Link
              href="/profile"
              style={{
                color: "var(--text-muted)",
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 500,
                padding: "6px 12px",
                borderRadius: 8,
              }}
            >
              Profile
            </Link>

            {/* Invitations with badge */}
            <Link
              href="/invitations"
              style={{
                color: "var(--text-muted)",
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 500,
                padding: "6px 12px",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                gap: 6,
                position: "relative",
              }}
            >
              Invitations
              {pendingInvitations > 0 && (
                <span
                  style={{
                    background: "#ef4444",
                    color: "white",
                    fontSize: 10,
                    fontWeight: 700,
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    lineHeight: 1,
                  }}
                >
                  {pendingInvitations > 9 ? "9+" : pendingInvitations}
                </span>
              )}
            </Link>
          </>
        )}

        {session ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginLeft: 8,
            }}
          >
            {session.user?.image && (
              <img
                src={session.user.image}
                alt={session.user.name || "User"}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  border: "2px solid var(--border)",
                }}
              />
            )}
            <SignOutButton />
          </div>
        ) : (
          <Link
            href="/signin"
            style={{
              background: "#6366f1",
              color: "white",
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 600,
              padding: "8px 16px",
              borderRadius: 8,
              marginLeft: 8,
            }}
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}