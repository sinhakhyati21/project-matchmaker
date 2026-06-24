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
        toast.error("No matching candidates found. Try adding more skills to your project.");
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
    <div className="border rounded-xl p-5 space-y-4 mt-4">
      <div className="flex justify-between gap-4 items-center">
        <div>
          <h3 className="font-bold text-lg">AI Team Recommendations</h3>
          <p className="text-sm text-gray-500">
            Ranked by skill match + GitHub activity + trust score
          </p>
        </div>
        <button
          onClick={fetchRecommendations}
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          {loading ? "Finding..." : "Find Teammates"}
        </button>
      </div>

      {recommendations.length === 0 ? (
        <p className="text-sm text-gray-500">
          No recommendations loaded yet. Click Find Teammates.
        </p>
      ) : (
        <div className="space-y-3">
          {recommendations.map((user) => (
            <div
              key={user._id}
              className="border rounded-xl p-4 space-y-3"
            >
              <div className="flex justify-between gap-4">
                {/* Left: User Info */}
                <div className="flex gap-3">
                  {user.image && (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-12 h-12 rounded-full"
                    />
                  )}
                  <div>
                    <h4 className="font-bold">{user.name}</h4>
                    <p className="text-sm text-gray-500">
                      @{user.githubUsername || "github"}
                    </p>
                    <p className="text-sm mt-1">
                      {user.status?.replaceAll("_", " ") || "Unknown"}
                    </p>
                    <p className="text-sm mt-1">
                      Matched:{" "}
                      {user.matchedSkills.length > 0
                        ? user.matchedSkills.join(", ")
                        : "No skill match"}
                    </p>
                  </div>
                </div>

                {/* Right: Score */}
                <div className="text-right min-w-[120px]">
                  <p className="font-bold text-2xl text-indigo-600">
                    {user.score}
                  </p>
                  <p className="text-xs text-gray-500">total score</p>
                  <p className="text-xs mt-1 text-gray-500">
                    Skills: {user.skillScore}/80
                  </p>
                  <p className="text-xs text-gray-500">
                    Activity: {user.activityScore}/20
                  </p>
                  <p className="text-xs mt-1">
                    Trust:{" "}
                    {user.trustScore.count === 0
                      ? "No reviews"
                      : `${user.trustScore.average}/5`}
                  </p>
                </div>
              </div>

              {/* Invite Button */}
              <button
                onClick={() => sendInvitation(user._id)}
                disabled={
                  invitedIds.includes(user._id) || invitingId === user._id
                }
                className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg disabled:opacity-50 text-sm"
              >
                {invitedIds.includes(user._id)
                  ? "✓ Invitation Sent"
                  : invitingId === user._id
                  ? "Sending..."
                  : "Send Invitation"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}