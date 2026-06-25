"use client";

import ApplicationActions from "./ApplicationActions";

type Applicant = {
  _id: string;
  status: string;
  user?: {
    name?: string;
    githubUsername?: string;
    image?: string;
    skills?: string[];
  };
  project?: {
    title?: string;
  };
};

const APP_STATUS_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  PENDING: { bg: "rgba(245,158,11,0.12)", color: "#f59e0b", border: "rgba(245,158,11,0.35)" },
  ACCEPTED: { bg: "rgba(34,197,94,0.12)", color: "#22c55e", border: "rgba(34,197,94,0.35)" },
  REJECTED: { bg: "rgba(239,68,68,0.12)", color: "#ef4444", border: "rgba(239,68,68,0.35)" },
};

export default function ApplicantRow({ application }: { application: Applicant }) {
  const appStatus = application.status || "PENDING";
  const appStatusStyle = APP_STATUS_COLORS[appStatus] || APP_STATUS_COLORS.PENDING;

  function goToProfile() {
    if (application.user?.githubUsername) {
      window.open(`/users/${application.user.githubUsername}`, "_blank");
    }
  }

  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 10,
        padding: "16px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 16,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {application.user?.image && (
          <img
            src={application.user.image}
            alt={application.user.name || "User"}
            onClick={goToProfile}
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              border: "1px solid var(--border)",
              cursor: application.user?.githubUsername ? "pointer" : "default",
            }}
          />
        )}
        <div>
          <h3
            onClick={goToProfile}
            style={{
              fontWeight: 600,
              fontSize: 14,
              color: application.user?.githubUsername ? "#6366f1" : "var(--text-primary)",
              marginBottom: 2,
              cursor: application.user?.githubUsername ? "pointer" : "default",
              textDecoration: application.user?.githubUsername ? "underline" : "none",
            }}
          >
            {application.user?.name || "Unknown User"}
          </h3>
          <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
            @{application.user?.githubUsername || "github"} · {application.project?.title}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 5 }}>
            {application.user?.skills?.slice(0, 4).map((skill: string) => (
              <span
                key={skill}
                style={{
                  background: "rgba(99,102,241,0.08)",
                  color: "#818cf8",
                  border: "1px solid rgba(99,102,241,0.15)",
                  padding: "1px 7px",
                  borderRadius: 4,
                  fontSize: 11,
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
        <span
          style={{
            background: appStatusStyle.bg,
            color: appStatusStyle.color,
            border: `1px solid ${appStatusStyle.border}`,
            padding: "5px 12px",
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase" as const,
          }}
        >
          {appStatus}
        </span>
        <ApplicationActions
          applicationId={application._id}
          status={application.status}
        />
      </div>
    </div>
  );
}