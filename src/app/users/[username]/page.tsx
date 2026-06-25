import { notFound } from "next/navigation";
import { connectDB } from "../../../lib/db";
import User from "../../../models/User.model";
import GitHubRepos from "../../../components/GitHubRepos";
import ContributionGraph from "../../../components/ContributionGraph";
import "../../../models/Review.model";
import { getTrustScore } from "../../../lib/trustScore";

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  AVAILABLE: { bg: "rgba(34,197,94,0.15)", color: "#4ade80" },
  BUSY: { bg: "rgba(239,68,68,0.15)", color: "#f87171" },
  LOOKING_FOR_TEAM: { bg: "rgba(99,102,241,0.15)", color: "#818cf8" },
  LOOKING_FOR_PROJECT: { bg: "rgba(34,211,238,0.15)", color: "#22d3ee" },
};

export default async function PublicUserProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  await connectDB();

  const user = await User.findOne({ githubUsername: username });
  if (!user) {
    notFound();
  }

  const safeUser = JSON.parse(JSON.stringify(user));
  const trustScore = await getTrustScore(safeUser._id);
  const statusStyle = STATUS_COLORS[safeUser.status] || null;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>

      {/* Header Card */}
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          padding: 28,
          display: "flex",
          gap: 24,
          alignItems: "flex-start",
          marginBottom: 24,
          flexWrap: "wrap",
        }}
      >
        {safeUser.image && (
          <img
            src={safeUser.image}
            alt={safeUser.name}
            style={{
              width: 88,
              height: 88,
              borderRadius: "50%",
              border: "3px solid var(--border)",
              flexShrink: 0,
            }}
          />
        )}
        <div style={{ flex: 1, minWidth: 200 }}>
          <h1
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: "var(--text-primary)",
              marginBottom: 4,
            }}
          >
            {safeUser.name}
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 8 }}>
            @{safeUser.githubUsername}
          </p>
          <p
            style={{
              fontSize: 14,
              color: "var(--text-muted)",
              lineHeight: 1.6,
              marginBottom: 12,
            }}
          >
            {safeUser.githubBio || "No GitHub bio available."}
          </p>
          {safeUser.status && (
            <span
              style={{
                background: statusStyle?.bg || "rgba(161,161,170,0.15)",
                color: statusStyle?.color || "#a1a1aa",
                padding: "4px 12px",
                borderRadius: 9999,
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {safeUser.status.replaceAll("_", " ")}
            </span>
          )}
        </div>

        {/* Trust Score */}
        <div
          style={{
            background: "rgba(99,102,241,0.1)",
            border: "1px solid rgba(99,102,241,0.3)",
            borderRadius: 12,
            padding: "16px 20px",
            textAlign: "center",
            flexShrink: 0,
          }}
        >
          <p
            style={{
              fontSize: 32,
              fontWeight: 800,
              color: "#818cf8",
              lineHeight: 1,
            }}
          >
            {trustScore.count === 0 ? "—" : trustScore.average}
          </p>
          <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
            Trust Score
          </p>
          <p style={{ fontSize: 11, color: "var(--text-muted)" }}>
            {trustScore.count === 0
              ? "No reviews"
              : `${trustScore.count} review${trustScore.count > 1 ? "s" : ""}`}
          </p>
        </div>
      </div>

      {/* Skills */}
      {safeUser.skills?.length > 0 && (
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 16,
            padding: "20px 24px",
            marginBottom: 24,
          }}
        >
          <h2
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "var(--text-primary)",
              marginBottom: 12,
            }}
          >
            Skills
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {safeUser.skills.map((skill: string) => (
              <span
                key={skill}
                style={{
                  background: "rgba(99,102,241,0.1)",
                  color: "#818cf8",
                  border: "1px solid rgba(99,102,241,0.2)",
                  padding: "4px 12px",
                  borderRadius: 9999,
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Contribution Graph */}
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          padding: "20px 24px",
          marginBottom: 24,
        }}
      >
        <h2
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: "var(--text-primary)",
            marginBottom: 16,
          }}
        >
          GitHub Contribution Graph
        </h2>
        <ContributionGraph username={safeUser.githubUsername} />
      </div>

      {/* Repos */}
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          padding: "20px 24px",
        }}
      >
        <h2
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: "var(--text-primary)",
            marginBottom: 16,
          }}
        >
          Public Repositories
        </h2>
        <GitHubRepos username={safeUser.githubUsername} />
      </div>
    </div>
  );
}