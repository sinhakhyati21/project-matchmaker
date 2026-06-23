"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Task = {
  _id: string;
  title: string;
  description?: string;
  status: "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";
};

const columns = [
  { key: "TODO", title: "To Do" },
  { key: "IN_PROGRESS", title: "In Progress" },
  { key: "REVIEW", title: "Review" },
  { key: "DONE", title: "Done" },
] as const;

export default function KanbanBoard({ tasks }: { tasks: Task[] }) {
  const router = useRouter();
  const [loadingTaskId, setLoadingTaskId] = useState<string | null>(null);

  async function updateTaskStatus(
    taskId: string,
    nextStatus: Task["status"]
  ) {
    const task = tasks.find((item) => item._id === taskId);

    if (task?.status === "TODO" && nextStatus !== "TODO") {
      const confirmed = window.confirm(
        "Once this task is started, it cannot be moved back to To Do. Continue?"
      );

      if (!confirmed) return;
    }

    setLoadingTaskId(taskId);

    const res = await fetch(`/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: nextStatus }),
    });

    if (res.ok) {
      router.refresh();
    } else {
      const data = await res.json();
      alert(data.message || "Failed to update task");
    }

    setLoadingTaskId(null);
  }

  return (
    <div className="grid md:grid-cols-4 gap-4">
      {columns.map((column) => (
        <div
          key={column.key}
          className="border rounded-xl p-4 bg-gray-50 min-h-64"
        >
          <h3 className="font-bold mb-4">{column.title}</h3>

          <div className="space-y-3">
            {tasks
              .filter((task) => task.status === column.key)
              .map((task) => (
                <div
                  key={task._id}
                  className="bg-white border rounded-lg p-3 shadow-sm space-y-3"
                >
                  <div>
                    <h4 className="font-semibold">{task.title}</h4>

                    {task.description && (
                      <p className="text-sm text-gray-500 mt-1">
                        {task.description}
                      </p>
                    )}
                  </div>

                  <select
                    value={task.status}
                    disabled={loadingTaskId === task._id}
                    onChange={(e) =>
                      updateTaskStatus(
                        task._id,
                        e.target.value as Task["status"]
                      )
                    }
                    className="border rounded-lg px-2 py-1 text-sm w-full"
                  >
                    {task.status === "TODO" && (
                      <option value="TODO">To Do</option>
                    )}

                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="REVIEW">Review</option>
                    <option value="DONE">Done</option>
                  </select>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}