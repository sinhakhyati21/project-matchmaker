import Link from "next/link";
import { auth } from "../auth";
import SignOutButton from "./SignOutButton";
import { connectDB } from "../lib/db";
import Invitation from "../models/Invitation.model";
import Application from "../models/Application.model";
import Project from "../models/Project.model";
import ThemeToggle from "./ThemeToggle";
import MobileNav from "./MobileNav";

export default async function Navbar() {
  const session = await auth();

  let pendingInvitations = 0;
  let pendingApplications = 0;

  if (session) {
    await connectDB();

    pendingInvitations = await Invitation.countDocuments({
      receiver: session.user.id,
      status: "PENDING",
    });

    // Get all projects owned by user
    const myProjects = await Project.find(
      { owner: session.user.id },
      { _id: 1 }
    );

    // Count pending applications to those projects
    pendingApplications = await Application.countDocuments({
      project: { $in: myProjects.map((p) => p._id) },
      status: "PENDING",
    });
  }

  return (
    <nav
      style={{
        background: "var(--surface)",
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

      {/* Desktop Nav Links */}
      <div
        className="desktop-nav"
        style={{ alignItems: "center", gap: 8 }}
      >
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

            {/* Dashboard with pending applications badge */}
            <Link
              href="/dashboard"
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
              }}
            >
              Dashboard
              {pendingApplications > 0 && (
                <span
                  style={{
                    background: "#f59e0b",
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
                  {pendingApplications > 9 ? "9+" : pendingApplications}
                </span>
              )}
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
            <ThemeToggle />
            <SignOutButton />
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginLeft: 8,
            }}
          >
            <ThemeToggle />
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
              }}
            >
              Sign In
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Nav */}
      <div className="mobile-nav">
        <MobileNav
          session={!!session}
          pendingInvitations={pendingInvitations}
          pendingApplications={pendingApplications}
          userImage={session?.user?.image || null}
        />
      </div>
    </nav>
  );
}