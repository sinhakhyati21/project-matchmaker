"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function CreateTaskForm({
  hubId,
  projectId,
}: {
  hubId: string;
  projectId: string;
}) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Task title is required");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hubId, projectId, title, description }),
    });

    if (res.ok) {
      toast.success("Task created!");
      setTitle("");
      setDescription("");
      router.refresh();
    } else {
      const data = await res.json();
      toast.error(data.message || "Failed to create task");
    }
    setLoading(false);
  }

  const inputStyle = {
    width: "100%",
    background: "var(--background)",
    border: "1px solid var(--border)",
    color: "var(--text-primary)",
    borderRadius: 8,
    padding: "10px 14px",
    fontSize: 14,
    outline: "none",
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        padding: "20px 24px",
        display: "flex",
        flexDirection: "column" as const,
        gap: 12,
      }}
    >
      <h3
        style={{
          fontSize: 15,
          fontWeight: 700,
          color: "var(--text-primary)",
          marginBottom: 4,
        }}
      >
        Create Task
      </h3>
      <input
        style={inputStyle}
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        style={{ ...inputStyle, minHeight: 60, resize: "vertical" as const }}
        placeholder="Task description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button
        disabled={loading}
        style={{
          background: loading ? "var(--border)" : "#6366f1",
          color: "white",
          border: "none",
          padding: "10px 20px",
          borderRadius: 8,
          fontSize: 14,
          fontWeight: 600,
          cursor: loading ? "not-allowed" : "pointer",
          alignSelf: "flex-start" as const,
        }}
      >
        {loading ? "Creating..." : "Create Task"}
      </button>
    </form>
  );
}