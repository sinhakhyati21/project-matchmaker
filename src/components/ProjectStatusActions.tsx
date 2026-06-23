"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type ProjectStatus =
  | "RECRUITING"
  | "ACTIVE"
  | "COMPLETED"
  | "ARCHIVED";

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
      `Are you sure you want to mark this project as ${status}?`
    );

    if (!confirmed) return;

    setLoading(true);

    const res = await fetch(`/api/projects/${projectId}/status`, {
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
      alert(data.message || "Failed to update status");
    }

    setLoading(false);
  }

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {currentStatus !== "RECRUITING" && (
        <button
          disabled={loading}
          onClick={() => updateStatus("RECRUITING")}
          className="border px-3 py-2 rounded-lg"
        >
          Recruiting
        </button>
      )}

      {currentStatus !== "ACTIVE" && (
        <button
          disabled={loading}
          onClick={() => updateStatus("ACTIVE")}
          className="bg-blue-600 text-white px-3 py-2 rounded-lg"
        >
          Active
        </button>
      )}

      {currentStatus !== "COMPLETED" && (
        <button
          disabled={loading}
          onClick={() => updateStatus("COMPLETED")}
          className="bg-green-600 text-white px-3 py-2 rounded-lg"
        >
          Completed
        </button>
      )}

      {currentStatus !== "ARCHIVED" && (
        <button
          disabled={loading}
          onClick={() => updateStatus("ARCHIVED")}
          className="bg-gray-700 text-white px-3 py-2 rounded-lg"
        >
          Archive
        </button>
      )}
    </div>
  );
}