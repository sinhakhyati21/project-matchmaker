"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type ProjectCardProps = {
  project: {
    _id: string;
    title: string;
    description: string;
    category: string;
    requiredSkills: string[];
    requiredRoles: string[];
    maxTeamSize: number;
    members: string[];
    status?: string;
    owner?: {
      name?: string;
      githubUsername?: string;
      image?: string;
    };
  };
};

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  RECRUITING: { bg: "rgba(34,197,94,0.15)", color: "#4ade80" },
  ACTIVE: { bg: "rgba(99,102,241,0.15)", color: "#818cf8" },
  COMPLETED: { bg: "rgba(245,158,11,0.15)", color: "#fbbf24" },
  ARCHIVED: { bg: "rgba(161,161,170,0.15)", color: "#a1a1aa" },
};

export default function ProjectCard({ project }: ProjectCardProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState(false);

  const status = project.status || "RECRUITING";
  const statusStyle = STATUS_COLORS[status] || STATUS_COLORS.RECRUITING;
  const memberCount = (project.members?.length || 0) + 1;
  const progressPct = Math.round((memberCount / project.maxTeamSize) * 100);

  async function applyToProject() {
    if (!session) {
      toast.error("Please sign in to apply");
      router.push("/signin");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId: project._id }),
    });

    const data = await res.json();
    if (res.ok) {
      toast.success("Applied successfully!");
      setApplied(true);
    } else {
      toast.error(data.message || "Failed to apply");
    }
    setLoading(false);
  }

  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 16,
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 16,
        transition: "border-color 0.2s ease, transform 0.2s ease",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#6366f1";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <h2
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "var(--text-primary)",
              marginBottom: 4,
            }}
          >
            {project.title}
          </h2>
          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
            {project.category}
          </p>
        </div>
        <span
          style={{
            background: statusStyle.bg,
            color: statusStyle.color,
            padding: "4px 12px",
            borderRadius: 9999,
            fontSize: 12,
            fontWeight: 600,
            whiteSpace: "nowrap",
            marginLeft: 12,
          }}
        >
          {status}
        </span>
      </div>

      {/* Description */}
      <p
        style={{
          fontSize: 14,
          color: "var(--text-muted)",
          lineHeight: 1.6,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {project.description}
      </p>

      {/* Skills */}
      {project.requiredSkills.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {project.requiredSkills.slice(0, 5).map((skill) => (
            <span
              key={skill}
              style={{
                background: "rgba(99,102,241,0.1)",
                color: "#818cf8",
                border: "1px solid rgba(99,102,241,0.2)",
                padding: "2px 10px",
                borderRadius: 9999,
                fontSize: 12,
                fontWeight: 500,
              }}
            >
              {skill}
            </span>
          ))}
          {project.requiredSkills.length > 5 && (
            <span
              style={{
                color: "var(--text-muted)",
                fontSize: 12,
                padding: "2px 6px",
              }}
            >
              +{project.requiredSkills.length - 5} more
            </span>
          )}
        </div>
      )}

      {/* Team Progress */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 6,
          }}
        >
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
            Team Progress
          </span>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
            {memberCount}/{project.maxTeamSize} members
          </span>
        </div>
        <div
          style={{
            height: 4,
            background: "var(--border)",
            borderRadius: 9999,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progressPct}%`,
              background: "#6366f1",
              borderRadius: 9999,
              transition: "width 0.3s ease",
            }}
          />
        </div>
      </div>

      {/* Owner */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {project.owner?.image && (
          <img
            src={project.owner.image}
            alt={project.owner.name || "Owner"}
            style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              border: "1px solid var(--border)",
            }}
          />
        )}
        <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
          {project.owner?.name || project.owner?.githubUsername || "Unknown"}
        </span>
      </div>

      {/* Apply Button */}
      <button
        onClick={applyToProject}
        disabled={loading || applied}
        style={{
          background: applied ? "rgba(34,197,94,0.15)" : "#6366f1",
          color: applied ? "#4ade80" : "white",
          border: applied ? "1px solid rgba(34,197,94,0.3)" : "none",
          padding: "10px 20px",
          borderRadius: 8,
          fontWeight: 600,
          fontSize: 14,
          cursor: loading || applied ? "not-allowed" : "pointer",
          opacity: loading ? 0.7 : 1,
          transition: "all 0.2s",
        }}
      >
        {applied
          ? "✓ Applied"
          : loading
          ? "Applying..."
          : session
          ? "Apply to Project"
          : "Sign in to Apply"}
      </button>
    </div>
  );
}