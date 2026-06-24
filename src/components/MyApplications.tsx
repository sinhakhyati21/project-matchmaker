"use client";

import { useEffect, useState } from "react";

type Application = {
  _id: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  updatedAt: string;
  project?: {
    title: string;
    description: string;
    status: string;
  };
};

const STATUS_CONFIG = {
  PENDING: {
    color: "#fbbf24",
    bg: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.2)",
    label: "Pending Review",
    icon: "⏳",
  },
  ACCEPTED: {
    color: "#4ade80",
    bg: "rgba(34,197,94,0.1)",
    border: "rgba(34,197,94,0.2)",
    label: "Accepted",
    icon: "✓",
  },
  REJECTED: {
    color: "#f87171",
    bg: "rgba(239,68,68,0.1)",
    border: "rgba(239,68,68,0.2)",
    label: "Not Selected",
    icon: "✕",
  },
};

export default function MyApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/applications")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setApplications(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const acceptedCount = applications.filter(
    (a) => a.status === "ACCEPTED"
  ).length;
  const pendingCount = applications.filter(
    (a) => a.status === "PENDING"
  ).length;

  if (loading) {
    return (
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          padding: 20,
          marginBottom: 48,
        }}
      >
        <div
          style={{
            height: 16,
            background: "var(--border)",
            borderRadius: 8,
            width: 160,
            marginBottom: 16,
          }}
        />
        <div
          style={{
            height: 60,
            background: "var(--border)",
            borderRadius: 8,
            opacity: 0.5,
          }}
        />
      </div>
    );
  }

  if (applications.length === 0) return null;

  return (
    <section style={{ marginBottom: 48 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <h2
          style={{
            fontSize: 18,
            fontWeight: 600,
            color: "var(--text-primary)",
          }}
        >
          My Applications
        </h2>
        <div style={{ display: "flex", gap: 8 }}>
          {acceptedCount > 0 && (
            <span
              style={{
                background: "rgba(34,197,94,0.1)",
                color: "#4ade80",
                border: "1px solid rgba(34,197,94,0.2)",
                padding: "3px 10px",
                borderRadius: 9999,
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {acceptedCount} accepted
            </span>
          )}
          {pendingCount > 0 && (
            <span
              style={{
                background: "rgba(245,158,11,0.1)",
                color: "#fbbf24",
                border: "1px solid rgba(245,158,11,0.2)",
                padding: "3px 10px",
                borderRadius: 9999,
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {pendingCount} pending
            </span>
          )}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {applications.map((application) => {
          const config =
            STATUS_CONFIG[application.status] || STATUS_CONFIG.PENDING;
          return (
            <div
              key={application._id}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 10,
                padding: "14px 16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 16,
              }}
            >
              <div>
                <h3
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    marginBottom: 2,
                  }}
                >
                  {application.project?.title || "Unknown Project"}
                </h3>
                <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  Updated{" "}
                  {new Date(application.updatedAt).toLocaleDateString("en-IN", {
                    dateStyle: "medium",
                  })}
                </p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {/* Notification dot for accepted */}
                {application.status === "ACCEPTED" && (
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "#4ade80",
                      boxShadow: "0 0 6px #4ade80",
                      flexShrink: 0,
                    }}
                  />
                )}
                <span
                  style={{
                    background: config.bg,
                    color: config.color,
                    border: `1px solid ${config.border}`,
                    padding: "4px 12px",
                    borderRadius: 4,
                    fontSize: 11,
                    fontWeight: 600,
                    textTransform: "uppercase" as const,
                    letterSpacing: "0.05em",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  {config.icon} {config.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}