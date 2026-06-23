"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

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
      alert("Task title is required");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        hubId,
        projectId,
        title,
        description,
      }),
    });

    if (res.ok) {
      setTitle("");
      setDescription("");
      router.refresh();
    } else {
      const data = await res.json();
      alert(data.message || "Failed to create task");
    }

    setLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border rounded-xl p-4 space-y-3"
    >
      <h3 className="font-bold">Create Task</h3>

      <input
        className="border rounded-lg px-3 py-2 w-full"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="border rounded-lg px-3 py-2 w-full"
        placeholder="Task description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded-lg disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Task"}
      </button>
    </form>
  );
}