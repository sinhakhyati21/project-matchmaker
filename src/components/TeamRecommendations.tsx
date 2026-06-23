"use client";

import { useState } from "react";

type Recommendation = {
  _id: string;
  name: string;
  image?: string;
  githubUsername?: string;
  status?: string;
  skills: string[];
  matchedSkills: string[];
  score: number;
};

export default function TeamRecommendations({
  projectId,
}: {
  projectId: string;
}) {
  const [recommendations, setRecommendations] =
    useState<Recommendation[]>([]);

  const [loading, setLoading] = useState(false);

  async function fetchRecommendations() {
    setLoading(true);

    const res = await fetch("/api/recommendations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ projectId }),
    });

    if (res.ok) {
      const data = await res.json();
      setRecommendations(data);
    } else {
      const data = await res.json();
      alert(
        data.message || "Failed to load recommendations"
      );
    }

    setLoading(false);
  }

  return (
    <div className="border rounded-xl p-5 space-y-4 mt-4">
      <div className="flex justify-between gap-4 items-center">
        <div>
          <h3 className="font-bold text-lg">
            AI Team Recommendations
          </h3>

          <p className="text-sm text-gray-500">
            Skill-based candidate ranking
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
          No recommendations loaded yet.
        </p>
      ) : (
        <div className="space-y-3">
          {recommendations.map((user) => (
            <div
              key={user._id}
              className="border rounded-xl p-4 flex justify-between gap-4"
            >
              <div className="flex gap-3">
                {user.image && (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-12 h-12 rounded-full"
                  />
                )}

                <div>
                  <h4 className="font-bold">
                    {user.name}
                  </h4>

                  <p className="text-sm text-gray-500">
                    @{user.githubUsername || "github"}
                  </p>

                  <p className="text-sm mt-1">
                    Status:{" "}
                    {user.status?.replaceAll("_", " ") ||
                      "Unknown"}
                  </p>

                  <p className="text-sm mt-1">
                    Matched skills:{" "}
                    {user.matchedSkills.length > 0
                      ? user.matchedSkills.join(", ")
                      : "None"}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-bold text-lg">
                  {user.score}%
                </p>

                <p className="text-sm text-gray-500">
                  match
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}