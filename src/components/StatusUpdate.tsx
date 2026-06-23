"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const statuses = [
  "AVAILABLE",
  "BUSY",
  "LOOKING_FOR_TEAM",
  "LOOKING_FOR_PROJECT",
];

export default function StatusUpdate({
  currentStatus,
}: {
  currentStatus: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  async function updateStatus(newStatus: string) {
    setLoading(true);
    setStatus(newStatus);

    const res = await fetch("/api/user/status", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (res.ok) {
      router.refresh();
    } else {
      alert("Failed to update status");
    }

    setLoading(false);
  }

  return (
    <div className="space-y-2">
      <p className="font-semibold">Current Status</p>

      <select
        value={status}
        disabled={loading}
        onChange={(e) => updateStatus(e.target.value)}
        className="border rounded-lg px-3 py-2"
      >
        {statuses.map((item) => (
          <option key={item} value={item}>
            {item.replaceAll("_", " ")}
          </option>
        ))}
      </select>
    </div>
  );
}