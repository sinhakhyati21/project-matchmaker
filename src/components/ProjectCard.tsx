"use client";

import { useState } from "react";

type ProjectCardProps = {
  project: {
    _id: string;
    title: string;
    description: string;
    category: string;
    requiredSkills: string[];
    requiredRoles: string[];
    maxTeamSize: number;
    status?: string;
    owner?: {
      name?: string;
      githubUsername?: string;
      image?: string;
    };
  };
};

export default function ProjectCard({ project }: ProjectCardProps) {
  const [loading, setLoading] = useState(false);

  async function applyToProject() {
    setLoading(true);

    const res = await fetch("/api/applications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        projectId: project._id,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Applied successfully!");
    } else {
      alert(data.message || "Failed to apply");
    }

    setLoading(false);
  }

  return (
    <div className="border rounded-xl p-5 space-y-4 shadow-sm">
      <div>
        <h2 className="text-2xl font-bold">{project.title}</h2>
        <p className="text-sm text-gray-500">
          {project.category} · Team size: {project.maxTeamSize}
        </p>
      </div>

      <p className="text-gray-700">{project.description}</p>

      <div>
        <p className="font-semibold">Required Skills</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {project.requiredSkills.map((skill) => (
            <span
              key={skill}
              className="text-sm bg-gray-100 px-3 py-1 rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div>
        <p className="font-semibold">Required Roles</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {project.requiredRoles.map((role) => (
            <span
              key={role}
              className="text-sm bg-blue-100 px-3 py-1 rounded-full"
            >
              {role}
            </span>
          ))}
        </div>
      </div>

      <p className="text-sm text-gray-500">
        Owner: {project.owner?.name || project.owner?.githubUsername || "Unknown"}
      </p>

      <button
        onClick={applyToProject}
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded-lg disabled:opacity-50"
      >
        {loading ? "Applying..." : "Apply to Project"}
      </button>
    </div>
  );
}