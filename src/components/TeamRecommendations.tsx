"use client";

import { useState } from "react";
import { toast } from "sonner";

type Recommendation = {
  _id: string;
  name: string;
  image?: string;
  githubUsername?: string;
  status?: string;
  skills: string[];
  matchedSkills: string[];
  score: number;
  skillScore: number;
  activityScore: number;
  repoScore: number;
  experienceScore: number;
  trustScore: {
    average: number;
    count: number;
  };
};

export default function TeamRecommendations({
  projectId,
}: {
  projectId: string;
}) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [invitedIds, setInvitedIds] = useState<string[]>([]);
  const [invitingId, setInvitingId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  async function fetchRecommendations() {
    setLoading(true);
    const res = await fetch("/api/recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.length === 0) {
        toast.error("No matching candidates found.");
      } else {
        setExpanded(true);
      }
      setRecommendations(data);
    } else {
      const data = await res.json();
      toast.error(data.message || "Failed to load recommendations");
    }
    setLoading(false);
  }

  async function sendInvitation(userId: string) {
    setInvitingId(userId);
    const res = await fetch("/api/invitations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId, receiverId: userId }),
    });

    const data = await res.json();
    if (res.ok) {
      toast.success("Invitation sent!");
      setInvitedIds((prev) => [...prev, userId]);
    } else {
      toast.error(data.message || "Failed to send invitation");
    }
    setInvitingId(null);
  }

  return (
    <div
      style={{
        border: "1px solid var(--border)",
        borderRadius: 10,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 16px",
          background: "var(--background)",
        }}
      >
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 2 }}>
            AI Team Recommendations
          </p>
          <p style={{ fontSize: 11, color: "var(--text-muted)" }}>
            Skill match · GitHub activity · Trust score
          </p>
        </div>
        <button
          onClick={fetchRecommendations}
          disabled={loading}
          style={{
            background: "#6366f1",
            color: "white",
            border: "none",
            padding: "6px 14px",
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
            whiteSpace: "nowrap",
          }}
        >
          {loading ? "Finding..." : "Find Teammates"}
        </button>
      </div>

      {/* Results */}
      {recommendations.length > 0 && expanded && (
        <div
          style={{
            borderTop: "1px solid var(--border)",
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          {recommendations.map((user) => (
            <div
              key={user._id}
              style={{
                padding: "12px 16px",
                background: "var(--surface)",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 12,
                  marginBottom: 10,
                }}
              >
                {/* Left: User Info */}
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  {user.image && (
                    <img
                      src={user.image}
                      alt={user.name}
                      onClick={() => user.githubUsername && window.open(`/users/${user.githubUsername}`, "_blank")}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        border: "1px solid var(--border)",
                        flexShrink: 0,
                        cursor: user.githubUsername ? "pointer" : "default",
                      }}
                    />
                  )}
                  <div>
                    <p
                      onClick={() => user.githubUsername && window.open(`/users/${user.githubUsername}`, "_blank")}
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: user.githubUsername ? "#6366f1" : "var(--text-primary)",
                        marginBottom: 2,
                        cursor: user.githubUsername ? "pointer" : "default",
                        textDecoration: user.githubUsername ? "underline" : "none",
                      }}
                    >
                      {user.name}
                    </p>
                    <p style={{ fontSize: 11, color: "var(--text-muted)" }}>
                      @{user.githubUsername || "github"}
                    </p>
                    {user.matchedSkills.length > 0 && (
                      <p style={{ fontSize: 11, color: "#818cf8", marginTop: 3 }}>
                        ✓ {user.matchedSkills.join(", ")}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Score */}
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <p style={{ fontSize: 20, fontWeight: 800, color: "#6366f1", lineHeight: 1 }}>
                    {user.score}
                  </p>
                  <p style={{ fontSize: 10, color: "var(--text-muted)" }}>score</p>
                  <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 4, lineHeight: 1.6 }}>
                    <div>Skills {user.skillScore}/80</div>
                    <div>Activity {user.activityScore}/20</div>
                    <div>Repos {user.repoScore}/20</div>
                    <div>Exp {user.experienceScore}/10</div>
                    <div>
                      Trust:{" "}
                      {user.trustScore.count === 0 ? "—" : `${user.trustScore.average}/5`}
                    </div>
                  </div>
                </div>
              </div>

              {/* Invite Button */}
              <button
                onClick={() => sendInvitation(user._id)}
                disabled={invitedIds.includes(user._id) || invitingId === user._id}
                style={{
                  width: "100%",
                  background: invitedIds.includes(user._id)
                    ? "rgba(34,197,94,0.1)"
                    : "rgba(99,102,241,0.1)",
                  color: invitedIds.includes(user._id) ? "#4ade80" : "#818cf8",
                  border: `1px solid ${
                    invitedIds.includes(user._id)
                      ? "rgba(34,197,94,0.2)"
                      : "rgba(99,102,241,0.2)"
                  }`,
                  padding: "6px 12px",
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor:
                    invitedIds.includes(user._id) || invitingId === user._id
                      ? "not-allowed"
                      : "pointer",
                  opacity: invitingId === user._id ? 0.6 : 1,
                }}
              >
                {invitedIds.includes(user._id)
                  ? "✓ Invitation Sent"
                  : invitingId === user._id
                  ? "Sending..."
                  : "Send Invitation"}
              </button>
            </div>
          ))}

          {/* Collapse button */}
          <button
            onClick={() => setExpanded(false)}
            style={{
              width: "100%",
              padding: "8px",
              background: "var(--background)",
              border: "none",
              fontSize: 11,
              color: "var(--text-muted)",
              cursor: "pointer",
            }}
          >
            Hide recommendations
          </button>
        </div>
      )}

      {recommendations.length > 0 && !expanded && (
        <button
          onClick={() => setExpanded(true)}
          style={{
            width: "100%",
            padding: "8px",
            background: "var(--background)",
            border: "none",
            borderTop: "1px solid var(--border)",
            fontSize: 11,
            color: "#818cf8",
            cursor: "pointer",
          }}
        >
          Show {recommendations.length} recommendation
          {recommendations.length > 1 ? "s" : ""}
        </button>
      )}
    </div>
  );
}