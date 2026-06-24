"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function ApplicationActions({
  applicationId,
  status,
}: {
  applicationId: string;
  status: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function updateStatus(nextStatus: "ACCEPTED" | "REJECTED") {
    const message =
      nextStatus === "ACCEPTED"
        ? "Are you sure you want to accept this candidate?"
        : "Are you sure you want to reject this candidate?";

    const confirmed = window.confirm(message);
    if (!confirmed) return;

    setLoading(true);
    const res = await fetch(`/api/applications/${applicationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });

    const data = await res.json();
    if (res.ok) {
      toast.success(
        nextStatus === "ACCEPTED"
          ? "Candidate accepted!"
          : "Candidate rejected."
      );
      router.refresh();
    } else {
      toast.error(data.message || "Failed to update application");
    }
    setLoading(false);
  }

  // Already processed — show nothing, badge in dashboard handles the status display
  if (status !== "PENDING") {
    return null;
  }

  return (
    <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
      <button
        disabled={loading}
        onClick={() => updateStatus("ACCEPTED")}
        style={{
          background: "rgba(34,197,94,0.1)",
          color: "#4ade80",
          border: "1px solid rgba(34,197,94,0.2)",
          padding: "6px 14px",
          borderRadius: 6,
          fontSize: 13,
          fontWeight: 600,
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.5 : 1,
        }}
      >
        Accept
      </button>
      <button
        disabled={loading}
        onClick={() => updateStatus("REJECTED")}
        style={{
          background: "rgba(239,68,68,0.1)",
          color: "#f87171",
          border: "1px solid rgba(239,68,68,0.2)",
          padding: "6px 14px",
          borderRadius: 6,
          fontSize: 13,
          fontWeight: 600,
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.5 : 1,
        }}
      >
        Reject
      </button>
    </div>
  );
}