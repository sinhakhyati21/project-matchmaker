"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type ProjectStatus = "RECRUITING" | "ACTIVE" | "COMPLETED" | "ARCHIVED";

const ALL_STATUSES: ProjectStatus[] = [
  "RECRUITING",
  "ACTIVE",
  "COMPLETED",
  "ARCHIVED",
];

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
    const confirmed = window.confirm(`Mark this project as ${status}?`);
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

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 6,
      }}
    >
      <span
        style={{
          fontSize: 11,
          color: "var(--text-muted)",
          marginRight: 2,
        }}
      >
        Move to:
      </span>
      {ALL_STATUSES.filter((s) => s !== currentStatus).map((status) => (
        <button
          key={status}
          disabled={loading}
          onClick={() => updateStatus(status)}
          style={{
            background: "transparent",
            color: "var(--text-muted)",
            border: "1px solid var(--border)",
            padding: "3px 8px",
            borderRadius: 5,
            fontSize: 10,
            fontWeight: 500,
            cursor: loading ? "not-allowed" : "pointer",
            letterSpacing: "0.04em",
            textTransform: "uppercase" as const,
            opacity: loading ? 0.5 : 1,
          }}
        >
          {status}
        </button>
      ))}
    </div>
  );
}