"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type Member = {
  _id: string;
  name?: string;
  githubUsername?: string;
};

export default function ReviewForm({
  projectId,
  projectStatus,
  members,
  currentUserId,
}: {
  projectId: string;
  projectStatus: string;
  members: Member[];
  currentUserId: string;
}) {
  const router = useRouter();
  const [revieweeId, setRevieweeId] = useState("");
  const [communication, setCommunication] = useState(5);
  const [technicalSkills, setTechnicalSkills] = useState(5);
  const [reliability, setReliability] = useState(5);
  const [teamwork, setTeamwork] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const reviewableMembers = members.filter(
    (member) => member._id !== currentUserId
  );

  async function submitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!revieweeId) {
      toast.error("Please select a teammate to review");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId,
        revieweeId,
        communication,
        technicalSkills,
        reliability,
        teamwork,
        comment,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      toast.success("Review submitted!");
      setRevieweeId("");
      setCommunication(5);
      setTechnicalSkills(5);
      setReliability(5);
      setTeamwork(5);
      setComment("");
      router.refresh();
    } else {
      toast.error(data.message || "Failed to submit review");
    }
    setLoading(false);
  }

  // Locked state — project not completed
  if (projectStatus !== "COMPLETED") {
    return (
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          padding: "24px 28px",
        }}
      >
        <h2
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: "var(--text-primary)",
            marginBottom: 10,
          }}
        >
          Review Teammates
        </h2>
        <p
          style={{
            fontSize: 14,
            color: "var(--text-muted)",
            lineHeight: 1.6,
          }}
        >
          Reviews will be unlocked when the project is marked as{" "}
          <span style={{ color: "#4ade80", fontWeight: 600 }}>Completed</span>.
        </p>
      </div>
    );
  }

  const inputStyle = {
    width: "100%",
    background: "var(--background)",
    border: "1px solid var(--border)",
    color: "var(--text-primary)",
    borderRadius: 8,
    padding: "10px 14px",
    fontSize: 14,
    outline: "none",
  };

  return (
    <form
      onSubmit={submitReview}
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        padding: "24px 28px",
        display: "flex",
        flexDirection: "column" as const,
        gap: 16,
      }}
    >
      <h2
        style={{
          fontSize: 16,
          fontWeight: 700,
          color: "var(--text-primary)",
        }}
      >
        Review a Teammate
      </h2>

      <select
        value={revieweeId}
        onChange={(e) => setRevieweeId(e.target.value)}
        style={inputStyle}
      >
        <option value="">Select teammate</option>
        {reviewableMembers.map((member) => (
          <option key={member._id} value={member._id}>
            {member.name || member.githubUsername || "Unknown"}
          </option>
        ))}
      </select>

      <RatingInput
        label="Communication"
        value={communication}
        onChange={setCommunication}
      />
      <RatingInput
        label="Technical Skills"
        value={technicalSkills}
        onChange={setTechnicalSkills}
      />
      <RatingInput
        label="Reliability"
        value={reliability}
        onChange={setReliability}
      />
      <RatingInput
        label="Teamwork"
        value={teamwork}
        onChange={setTeamwork}
      />

      <textarea
        style={{
          ...inputStyle,
          minHeight: 80,
          resize: "vertical" as const,
        }}
        placeholder="Optional feedback..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <button
        disabled={loading}
        style={{
          background: loading ? "var(--border)" : "#6366f1",
          color: "white",
          border: "none",
          padding: "10px 20px",
          borderRadius: 8,
          fontSize: 14,
          fontWeight: 600,
          cursor: loading ? "not-allowed" : "pointer",
          alignSelf: "flex-start" as const,
        }}
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}

function RatingInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: "var(--text-primary)",
        }}
      >
        {label}
      </label>
      <div style={{ display: "flex", gap: 8 }}>
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => onChange(rating)}
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              border: `1px solid ${
                value === rating ? "#6366f1" : "var(--border)"
              }`,
              background:
                value === rating
                  ? "rgba(99,102,241,0.15)"
                  : "var(--background)",
              color: value === rating ? "#818cf8" : "var(--text-muted)",
              fontWeight: value === rating ? 700 : 400,
              fontSize: 14,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {rating}
          </button>
        ))}
      </div>
    </div>
  );
}