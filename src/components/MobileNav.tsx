"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import ThemeToggle from "./ThemeToggle";

export default function MobileNav({
  session,
  pendingInvitations,
  pendingApplications,
  userImage,
}: {
  session: boolean;
  pendingInvitations: number;
  pendingApplications: number;
  userImage: string | null;
}) {
  const [open, setOpen] = useState(false);

  const linkStyle = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "12px 16px",
    fontSize: 15,
    fontWeight: 500,
    color: "var(--text-primary)",
    textDecoration: "none",
    borderRadius: 8,
    transition: "background 0.15s",
  };

  return (
    <>
      <ThemeToggle />

      {/* Hamburger */}
      <button
        onClick={() => setOpen((p) => !p)}
        style={{
          background: "transparent",
          border: "1px solid var(--border)",
          color: "var(--text-primary)",
          width: 36,
          height: 36,
          borderRadius: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 5,
          cursor: "pointer",
          padding: "6px",
        }}
      >
        <span
          style={{
            width: 18,
            height: 2,
            background: "var(--text-primary)",
            borderRadius: 2,
            transition: "all 0.2s",
            transform: open ? "rotate(45deg) translate(5px, 5px)" : "none",
          }}
        />
        <span
          style={{
            width: 18,
            height: 2,
            background: "var(--text-primary)",
            borderRadius: 2,
            opacity: open ? 0 : 1,
            transition: "all 0.2s",
          }}
        />
        <span
          style={{
            width: 18,
            height: 2,
            background: "var(--text-primary)",
            borderRadius: 2,
            transition: "all 0.2s",
            transform: open ? "rotate(-45deg) translate(5px, -5px)" : "none",
          }}
        />
      </button>

      {/* Drawer */}
      {open && (
        <>
          <div
            onClick={() => setOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.4)",
              zIndex: 98,
              top: 64,
            }}
          />

          <div
            style={{
              position: "fixed",
              top: 64,
              left: 0,
              right: 0,
              background: "var(--surface)",
              borderBottom: "1px solid var(--border)",
              zIndex: 99,
              padding: "12px 16px 20px",
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            {session && userImage && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 16px",
                  marginBottom: 4,
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <img
                  src={userImage}
                  alt="User"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    border: "2px solid var(--border)",
                  }}
                />
                <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>
                  My Account
                </span>
              </div>
            )}

            <a href="/projects" style={linkStyle} onClick={() => setOpen(false)}>
              Projects
            </a>

            {session && (
              <>
                <a href="/create-project" style={linkStyle} onClick={() => setOpen(false)}>
                  Create Project
                </a>

                <a href="/dashboard" style={linkStyle} onClick={() => setOpen(false)}>
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
                      }}
                    >
                      {pendingApplications > 9 ? "9+" : pendingApplications}
                    </span>
                  )}
                </a>

                <a href="/profile" style={linkStyle} onClick={() => setOpen(false)}>
                  Profile
                </a>

                <a href="/invitations" style={linkStyle} onClick={() => setOpen(false)}>
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
                      }}
                    >
                      {pendingInvitations > 9 ? "9+" : pendingInvitations}
                    </span>
                  )}
                </a>

                <div
                  style={{
                    marginTop: 8,
                    paddingTop: 12,
                    borderTop: "1px solid var(--border)",
                  }}
                >
                  <button
                    onClick={() => signOut()}
                    style={{
                      width: "100%",
                      background: "rgba(239,68,68,0.1)",
                      color: "#f87171",
                      border: "1px solid rgba(239,68,68,0.2)",
                      padding: "10px 16px",
                      borderRadius: 8,
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: "pointer",
                      textAlign: "left" as const,
                    }}
                  >
                    Sign Out
                  </button>
                </div>
              </>
            )}

            {!session && (
              
              <a  href="/signin"
                style={{
                  ...linkStyle,
                  background: "#6366f1",
                  color: "white",
                  justifyContent: "center",
                  marginTop: 8,
                }}
                onClick={() => setOpen(false)}
              >
                Sign In with GitHub
              </a>
            )}
          </div>
        </>
      )}
    </>
  );
}