"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type ProjectStatus = "RECRUITING" | "ACTIVE" | "COMPLETED" | "ARCHIVED";

export default function ProjectStatusActions({
  projectId,
  currentStatus,
}: {
  projectId: string;
  currentStatus: ProjectStatus;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function updateStatus(status: ProjectStatus) {
    const confirmed = window.confirm(
      `Mark this project as ${status}?`
    );
    if (!confirmed) return;

    setLoading(true);
    const res = await fetch(`/api/projects/${projectId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    const data = await res.json();
    if (res.ok) {
      toast.success(`Project marked as ${status}`);
      router.refresh();
    } else {
      toast.error(data.message || "Failed to update status");
    }
    setLoading(false);
  }

  const buttonStyle = {
    background: "transparent",
    color: "var(--text-muted)",
    border: "1px solid var(--border)",
    padding: "5px 10px",
    borderRadius: 6,
    fontSize: 11,
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s",
    textTransform: "uppercase" as const,
    letterSpacing: "0.04em",
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      <span style={{ fontSize: 11, color: "var(--text-muted)", alignSelf: "center" }}>
        Move to:
      </span>
      {currentStatus !== "RECRUITING" && (
        <button
          disabled={loading}
          onClick={() => updateStatus("RECRUITING")}
          style={buttonStyle}
        >
          Recruiting
        </button>
      )}
      {currentStatus !== "ACTIVE" && (
        <button
          disabled={loading}
          onClick={() => updateStatus("ACTIVE")}
          style={buttonStyle}
        >
          Active
        </button>
      )}
      {currentStatus !== "COMPLETED" && (
        <button
          disabled={loading}
          onClick={() => updateStatus("COMPLETED")}
          style={buttonStyle}
        >
          Completed
        </button>
      )}
      {currentStatus !== "ARCHIVED" && (
        <button
          disabled={loading}
          onClick={() => updateStatus("ARCHIVED")}
          style={buttonStyle}
        >
          Archive
        </button>
      )}
    </div>
  );
}