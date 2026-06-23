"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function InvitationActions({
  invitationId,
  status,
}: {
  invitationId: string;
  status: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function updateInvitation(nextStatus: "ACCEPTED" | "DECLINED") {
    const confirmed = window.confirm(
      nextStatus === "ACCEPTED"
        ? "Are you sure you want to accept this invitation?"
        : "Are you sure you want to decline this invitation?"
    );
    if (!confirmed) return;

    setLoading(true);
    const res = await fetch(`/api/invitations/${invitationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });

    const data = await res.json();
    if (res.ok) {
      toast.success(
        nextStatus === "ACCEPTED"
          ? "Invitation accepted! Check your dashboard for the Hub."
          : "Invitation declined."
      );
      router.refresh();
    } else {
      toast.error(data.message || "Failed to update invitation");
    }
    setLoading(false);
  }

  if (status !== "PENDING") {
    return <p className="mt-3 font-semibold">{status}</p>;
  }

  return (
    <div className="flex gap-2 mt-4">
      <button
        disabled={loading}
        onClick={() => updateInvitation("ACCEPTED")}
        className="bg-green-600 text-white px-3 py-2 rounded-lg disabled:opacity-50"
      >
        Accept
      </button>
      <button
        disabled={loading}
        onClick={() => updateInvitation("DECLINED")}
        className="bg-red-600 text-white px-3 py-2 rounded-lg disabled:opacity-50"
      >
        Decline
      </button>
    </div>
  );
}