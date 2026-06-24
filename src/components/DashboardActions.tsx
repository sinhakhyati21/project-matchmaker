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

  return (
    <div className="flex gap-3 mt-4">
      <button
        onClick={() => router.push(`/hub/${projectId}`)}
        className="text-blue-600 font-medium hover:underline"
      >
        Open Hub
      </button>
      {projectStatus !== "ACTIVE" && (
        <button
          onClick={deleteProject}
          disabled={loading}
          className="text-red-500 font-medium hover:underline disabled:opacity-50"
        >
          {loading ? "Deleting..." : "Delete"}
        </button>
      )}
    </div>
  );
}