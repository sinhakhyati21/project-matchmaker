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

  if (status !== "PENDING") {
    return <span className="font-semibold">{status}</span>;
  }

  return (
    <div className="flex gap-2">
      <button
        disabled={loading}
        onClick={() => updateStatus("ACCEPTED")}
        className="bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
      >
        Accept
      </button>
      <button
        disabled={loading}
        onClick={() => updateStatus("REJECTED")}
        className="bg-red-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
      >
        Reject
      </button>
    </div>
  );
}