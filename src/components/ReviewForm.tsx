"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Member = {
  _id: string;
  name?: string;
  githubUsername?: string;
};

export default function ReviewForm({
  projectId,
  members,
  currentUserId,
}: {
  projectId: string;
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

  async function submitReview(e: React.FormEvent) {
    e.preventDefault();

    if (!revieweeId) {
      alert("Select a teammate to review");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
      setRevieweeId("");
      setCommunication(5);
      setTechnicalSkills(5);
      setReliability(5);
      setTeamwork(5);
      setComment("");
      router.refresh();
    } else {
      alert(data.message || "Failed to submit review");
    }

    setLoading(false);
  }

//   const reviewableMembers = members.filter(
//     (member) => member._id !== currentUserId
//   );

const reviewableMembers =
  process.env.NODE_ENV === "development"
    ? members
    : members.filter((member) => member._id !== currentUserId);
  return (
    <form
      onSubmit={submitReview}
      className="border rounded-xl p-5 space-y-4"
    >
      <h2 className="text-2xl font-bold">Review Teammate</h2>

      <select
        value={revieweeId}
        onChange={(e) => setRevieweeId(e.target.value)}
        className="border rounded-lg px-3 py-2 w-full"
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
        className="border rounded-lg px-3 py-2 w-full"
        placeholder="Optional feedback"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <button
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded-lg disabled:opacity-50"
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
    <div>
      <label className="font-medium">{label}</label>

      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="border rounded-lg px-3 py-2 w-full mt-1"
      >
        {[1, 2, 3, 4, 5].map((rating) => (
          <option key={rating} value={rating}>
            {rating}
          </option>
        ))}
      </select>
    </div>
  );
}