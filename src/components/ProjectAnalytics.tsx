"use client";

import { useState } from "react";

type Analytics = {
  taskStats: {
    total: number;
    todo: number;
    inProgress: number;
    review: number;
    done: number;
    completionRate: number;
  };
  messages: {
    total: number;
    last7Days: number;
  };
  expenses: {
    total: number;
    count: number;
  };
  members: number;
};

export default function ProjectAnalytics({
  projectId,
}: {
  projectId: string;
}) {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  async function fetchAnalytics() {
    setLoading(true);
    const res = await fetch(`/api/analytics/${projectId}`);
    if (res.ok) {
      const data = await res.json();
      setAnalytics(data);
      setLoaded(true);
    }
    setLoading(false);
  }

  const TASK_COLUMNS = [
    { key: "todo", label: "To Do", color: "#a1a1aa", bg: "rgba(161,161,170,0.15)" },
    { key: "inProgress", label: "In Progress", color: "#818cf8", bg: "rgba(99,102,241,0.15)" },
    { key: "review", label: "Review", color: "#fbbf24", bg: "rgba(245,158,11,0.15)" },
    { key: "done", label: "Done", color: "#4ade80", bg: "rgba(34,197,94,0.15)" },
  ];

  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 16,
        padding: 24,
        marginTop: 16,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: loaded ? 24 : 0,
        }}
      >
        <div>
          <h3
            style={{
              fontWeight: 700,
              fontSize: 16,
              color: "var(--text-primary)",
              marginBottom: 4,
            }}
          >
            Project Analytics
          </h3>
          <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
            Task completion, team activity, expenses
          </p>
        </div>
        <button
          onClick={fetchAnalytics}
          disabled={loading}
          style={{
            background: loaded ? "transparent" : "#6366f1",
            color: loaded ? "var(--text-muted)" : "white",
            border: loaded ? "1px solid var(--border)" : "none",
            padding: "7px 14px",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Loading..." : loaded ? "Refresh" : "View Analytics"}
        </button>
      </div>

      {analytics && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Task Completion */}
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <h4
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--text-primary)",
                }}
              >
                Task Completion
              </h4>
              <span
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color:
                    analytics.taskStats.completionRate >= 70
                      ? "#4ade80"
                      : analytics.taskStats.completionRate >= 40
                      ? "#fbbf24"
                      : "#818cf8",
                }}
              >
                {analytics.taskStats.completionRate}%
              </span>
            </div>

            {/* Progress Bar */}
            <div
              style={{
                height: 8,
                background: "var(--border)",
                borderRadius: 9999,
                overflow: "hidden",
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${analytics.taskStats.completionRate}%`,
                  background:
                    analytics.taskStats.completionRate >= 70
                      ? "#4ade80"
                      : analytics.taskStats.completionRate >= 40
                      ? "#fbbf24"
                      : "#6366f1",
                  borderRadius: 9999,
                  transition: "width 0.5s ease",
                }}
              />
            </div>

            {/* Task breakdown */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 8,
              }}
            >
              {TASK_COLUMNS.map((col) => (
                <div
                  key={col.key}
                  style={{
                    background: col.bg,
                    border: `1px solid ${col.color}33`,
                    borderRadius: 8,
                    padding: "10px 12px",
                    textAlign: "center",
                  }}
                >
                  <p
                    style={{
                      fontSize: 20,
                      fontWeight: 800,
                      color: col.color,
                      lineHeight: 1,
                    }}
                  >
                    {analytics.taskStats[col.key as keyof typeof analytics.taskStats]}
                  </p>
                  <p
                    style={{
                      fontSize: 11,
                      color: "var(--text-muted)",
                      marginTop: 4,
                    }}
                  >
                    {col.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: "var(--border)" }} />

          {/* Team Activity + Expenses */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
            }}
          >
            {/* Team Activity */}
            <div
              style={{
                background: "rgba(34,211,238,0.05)",
                border: "1px solid rgba(34,211,238,0.2)",
                borderRadius: 12,
                padding: 16,
              }}
            >
              <p
                style={{
                  fontSize: 12,
                  color: "var(--text-muted)",
                  marginBottom: 8,
                }}
              >
                Team Activity
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div>
                  <p
                    style={{
                      fontSize: 22,
                      fontWeight: 800,
                      color: "#22d3ee",
                      lineHeight: 1,
                    }}
                  >
                    {analytics.messages.last7Days}
                  </p>
                  <p style={{ fontSize: 11, color: "var(--text-muted)" }}>
                    messages last 7 days
                  </p>
                </div>
                <div>
                  <p
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: "var(--text-primary)",
                    }}
                  >
                    {analytics.messages.total}
                  </p>
                  <p style={{ fontSize: 11, color: "var(--text-muted)" }}>
                    total messages
                  </p>
                </div>
                <div>
                  <p
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: "var(--text-primary)",
                    }}
                  >
                    {analytics.members}
                  </p>
                  <p style={{ fontSize: 11, color: "var(--text-muted)" }}>
                    team members
                  </p>
                </div>
              </div>
            </div>

            {/* Expenses */}
            <div
              style={{
                background: "rgba(99,102,241,0.05)",
                border: "1px solid rgba(99,102,241,0.2)",
                borderRadius: 12,
                padding: 16,
              }}
            >
              <p
                style={{
                  fontSize: 12,
                  color: "var(--text-muted)",
                  marginBottom: 8,
                }}
              >
                Project Expenses
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div>
                  <p
                    style={{
                      fontSize: 22,
                      fontWeight: 800,
                      color: "#818cf8",
                      lineHeight: 1,
                    }}
                  >
                    ₹{analytics.expenses.total.toFixed(0)}
                  </p>
                  <p style={{ fontSize: 11, color: "var(--text-muted)" }}>
                    total spent
                  </p>
                </div>
                <div>
                  <p
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: "var(--text-primary)",
                    }}
                  >
                    {analytics.expenses.count}
                  </p>
                  <p style={{ fontSize: 11, color: "var(--text-muted)" }}>
                    expense entries
                  </p>
                </div>
                <div>
                  <p
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: "var(--text-primary)",
                    }}
                  >
                    ₹
                    {analytics.expenses.count > 0
                      ? (
                          analytics.expenses.total / analytics.expenses.count
                        ).toFixed(0)
                      : 0}
                  </p>
                  <p style={{ fontSize: 11, color: "var(--text-muted)" }}>
                    avg per entry
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Project Progress Summary */}
          <div
            style={{
              background: "rgba(34,197,94,0.05)",
              border: "1px solid rgba(34,197,94,0.2)",
              borderRadius: 12,
              padding: 16,
            }}
          >
            <p
              style={{
                fontSize: 12,
                color: "var(--text-muted)",
                marginBottom: 8,
              }}
            >
              Project Health
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 12,
                textAlign: "center",
              }}
            >
              {[
                {
                  label: "Tasks Done",
                  value: `${analytics.taskStats.done}/${analytics.taskStats.total}`,
                  color: "#4ade80",
                },
                {
                  label: "Active Members",
                  value: analytics.members,
                  color: "#22d3ee",
                },
                {
                  label: "Completion",
                  value: `${analytics.taskStats.completionRate}%`,
                  color:
                    analytics.taskStats.completionRate >= 70
                      ? "#4ade80"
                      : "#fbbf24",
                },
              ].map((item) => (
                <div key={item.label}>
                  <p
                    style={{
                      fontSize: 18,
                      fontWeight: 800,
                      color: item.color,
                    }}
                  >
                    {item.value}
                  </p>
                  <p style={{ fontSize: 11, color: "var(--text-muted)" }}>
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}