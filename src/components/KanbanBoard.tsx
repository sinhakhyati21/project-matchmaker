"use client";

import { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { toast } from "sonner";

type Task = {
  _id: string;
  title: string;
  description?: string;
  status: "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";
};

const COLUMNS = [
  { key: "TODO", title: "To Do", color: "#a1a1aa", bg: "rgba(161,161,170,0.08)" },
  { key: "IN_PROGRESS", title: "In Progress", color: "#818cf8", bg: "rgba(99,102,241,0.08)" },
  { key: "REVIEW", title: "Review", color: "#fbbf24", bg: "rgba(245,158,11,0.08)" },
  { key: "DONE", title: "Done", color: "#4ade80", bg: "rgba(34,197,94,0.08)" },
] as const;

export default function KanbanBoard({
  tasks,
  onTasksChange,
}: {
  tasks: Task[];
  onTasksChange: (tasks: Task[]) => void;
}) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function moveTask(taskId: string, newStatus: Task["status"]) {
    const task = tasks.find((t) => t._id === taskId);
    if (!task || task.status === newStatus) return;

    if (task.status === "TODO" && newStatus !== "TODO") {
      const ok = window.confirm(
        "Once started, this task cannot go back to To Do. Continue?"
      );
      if (!ok) return;
    }

    // Optimistic update via parent
    onTasksChange(
      tasks.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
    );

    setLoadingId(taskId);
    const res = await fetch(`/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!res.ok) {
      // Revert on failure
      onTasksChange(tasks);
      const data = await res.json();
      toast.error(data.message || "Failed to update task");
    } else {
      toast.success("Task moved!");
    }
    setLoadingId(null);
  }

  function onDragEnd(result: DropResult) {
    if (!result.destination) return;
    const newStatus = result.destination.droppableId as Task["status"];
    moveTask(result.draggableId, newStatus);
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 12,
        }}
      >
        {COLUMNS.map((col) => (
          <div
            key={col.key}
            style={{
              background: col.bg,
              border: "1px solid var(--border)",
              borderRadius: 12,
              padding: 14,
              minHeight: 200,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 12,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: col.color,
                  flexShrink: 0,
                }}
              />
              <h3
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: col.color,
                  textTransform: "uppercase" as const,
                  letterSpacing: "0.05em",
                }}
              >
                {col.title}
              </h3>
              <span
                style={{
                  marginLeft: "auto",
                  fontSize: 11,
                  color: "var(--text-muted)",
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 9999,
                  padding: "1px 7px",
                }}
              >
                {tasks.filter((t) => t.status === col.key).length}
              </span>
            </div>

            <Droppable droppableId={col.key}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    minHeight: 40,
                    borderRadius: 8,
                    transition: "background 0.2s",
                    background: snapshot.isDraggingOver
                      ? "rgba(99,102,241,0.05)"
                      : "transparent",
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  {tasks
                    .filter((t) => t.status === col.key)
                    .map((task, index) => (
                      <Draggable
                        key={task._id}
                        draggableId={task._id}
                        index={index}
                        isDragDisabled={loadingId === task._id}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              ...provided.draggableProps.style,
                              background: "var(--surface)",
                              border: `1px solid ${
                                snapshot.isDragging ? "#6366f1" : "var(--border)"
                              }`,
                              borderRadius: 8,
                              padding: "10px 12px",
                              cursor: "grab",
                              boxShadow: snapshot.isDragging
                                ? "0 4px 20px rgba(99,102,241,0.2)"
                                : "none",
                              opacity: loadingId === task._id ? 0.5 : 1,
                            }}
                          >
                            <h4
                              style={{
                                fontSize: 13,
                                fontWeight: 600,
                                color: "var(--text-primary)",
                                marginBottom: task.description ? 4 : 0,
                              }}
                            >
                              {task.title}
                            </h4>
                            {task.description && (
                              <p
                                style={{
                                  fontSize: 12,
                                  color: "var(--text-muted)",
                                  lineHeight: 1.4,
                                }}
                              >
                                {task.description}
                              </p>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}