import { redirect } from "next/navigation";
import { auth } from "../../auth";
import { connectDB } from "../../lib/db";
import User from "../../models/User.model";
import StatusUpdate from "../../components/StatusUpdate";
import GitHubRepos from "../../components/GitHubRepos";
import ContributionGraph from "../../components/ContributionGraph";
import SkillsEditor from "../../components/SkillsEditor";
import "../../models/Review.model";
import { getTrustScore } from "../../lib/trustScore";
import ProfileGithubLink from "../../components/ProfileGithubLink";

export default async function ProfilePage() {
  const session = await auth();
  if (!session) {
    redirect("/signin");
  }

  await connectDB();

  const user = await User.findById(session.user.id);
  if (!user) {
    redirect("/signin");
  }

  const trustScore = await getTrustScore(session.user.id);
  const safeUser = JSON.parse(JSON.stringify(user));

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
        <div style={{ flex: 1 }}>
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
          {safeUser.githubUrl && (
            <ProfileGithubLink url={safeUser.githubUrl} />
          )}
        </div>

        {/* Trust Score Badge */}
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
            {trustScore.count === 0 ? "—" : `${trustScore.average}`}
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

      {/* Status */}
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          padding: 24,
          marginBottom: 24,
        }}
      >
        <StatusUpdate currentStatus={safeUser.status} />
      </div>

      {/* Skills */}
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          padding: 24,
          marginBottom: 24,
        }}
      >
        <SkillsEditor currentSkills={safeUser.skills || []} />
      </div>

      {/* Contribution Graph */}
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          padding: 24,
          marginBottom: 24,
        }}
      >
        <h2
          style={{
            fontSize: 18,
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
          padding: 24,
        }}
      >
        <h2
          style={{
            fontSize: 18,
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