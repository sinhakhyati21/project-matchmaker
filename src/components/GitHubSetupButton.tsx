"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function GitHubSetupButton({
  projectId,
  projectStatus,
}: {
  projectId: string;
  projectStatus: string;
}) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  if (projectStatus !== "ACTIVE") return null;
  if (done) return (
    <span
      style={{
        fontSize: 13,
        color: "#4ade80",
        fontWeight: 600,
      }}
    >
      ✓ GitHub repo created
    </span>
  );

  async function setupGitHub() {
    const confirmed = window.confirm(
      "This will create a GitHub repository and invite all team members. Continue?"
    );
    if (!confirmed) return;

    setLoading(true);
    const res = await fetch("/api/github/setup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId }),
    });

    const data = await res.json();
    if (res.ok) {
      toast.success("GitHub repo created and team invited!");
      setDone(true);
    } else {
      toast.error(data.message || "Failed to setup GitHub repo");
    }
    setLoading(false);
  }

  return (
    <button
      onClick={setupGitHub}
      disabled={loading}
      style={{
        background: "rgba(34,197,94,0.1)",
        color: "#4ade80",
        border: "1px solid rgba(34,197,94,0.3)",
        padding: "7px 14px",
        borderRadius: 8,
        fontSize: 13,
        fontWeight: 600,
        cursor: loading ? "not-allowed" : "pointer",
        opacity: loading ? 0.6 : 1,
        display: "flex",
        alignItems: "center",
        gap: 6,
      }}
    >
      {loading ? "Setting up..." : "⚡ Auto GitHub Setup"}
    </button>
  );
}