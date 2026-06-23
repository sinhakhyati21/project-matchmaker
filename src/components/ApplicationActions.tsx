"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ApplicationActions({
  applicationId,
  status,
}: {
  applicationId: string;
  status: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function updateStatus(status: "ACCEPTED" | "REJECTED") {
    setLoading(true);

    const res = await fetch(`/api/applications/${applicationId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    const data = await res.json();

    if (res.ok) {
      router.refresh();
    } else {
      alert(data.message || "Failed to update application");
    }

    setLoading(false);
  }

  function confirmAndUpdate(status: "ACCEPTED" | "REJECTED") {
    const message =
      status === "ACCEPTED"
        ? "Are you sure you want to accept this candidate?"
        : "Are you sure you want to reject this candidate?";

    const confirmed = window.confirm(message);

    if (confirmed) {
      updateStatus(status);
    }
  }

  if (status !== "PENDING") {
    return (
      <span className="font-semibold">
        {status}
      </span>
    );
  }

  return (
    <div className="flex gap-2">
      <button
        disabled={loading}
        onClick={() => confirmAndUpdate("ACCEPTED")}
        className="bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
      >
        Accept
      </button>

      <button
        disabled={loading}
        onClick={() => confirmAndUpdate("REJECTED")}
        className="bg-red-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
      >
        Reject
      </button>
    </div>
  );
}