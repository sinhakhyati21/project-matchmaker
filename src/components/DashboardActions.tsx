"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";

export default function DashboardActions({
  projectId,
  projectStatus,
}: {
  projectId: string;
  projectStatus: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function deleteProject() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project? This cannot be undone."
    );
    if (!confirmed) return;

    setLoading(true);
    const res = await fetch(`/api/projects/${projectId}`, {
      method: "DELETE",
    });

    const data = await res.json();
    if (res.ok) {
      toast.success("Project deleted!");
      router.refresh();
    } else {
      toast.error(data.message || "Failed to delete project");
    }
    setLoading(false);
  }

  const canEdit =
    projectStatus !== "ACTIVE" && projectStatus !== "COMPLETED";

  return (
    <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
      <button
        onClick={() => router.push(`/hub/${projectId}`)}
        style={{
          background: "rgba(99,102,241,0.1)",
          color: "#818cf8",
          border: "1px solid rgba(99,102,241,0.3)",
          padding: "7px 14px",
          borderRadius: 8,
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Open Hub
      </button>

      {canEdit && (
        <button
          onClick={() => router.push(`/edit-project/${projectId}`)}
          style={{
            background: "transparent",
            color: "var(--text-muted)",
            border: "1px solid var(--border)",
            padding: "7px 14px",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Edit
        </button>
      )}

      {canEdit && (
        <button
          onClick={deleteProject}
          disabled={loading}
          style={{
            background: "rgba(239,68,68,0.1)",
            color: "#f87171",
            border: "1px solid rgba(239,68,68,0.3)",
            padding: "7px 14px",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Deleting..." : "Delete"}
        </button>
      )}
    </div>
  );
}