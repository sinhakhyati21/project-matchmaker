"use client";

import { useState, useMemo } from "react";
import ProjectCard from "./ProjectCard";

type Project = {
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

export default function ProjectsClient({
  projects,
}: {
  projects: Project[];
}) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedSkill, setSelectedSkill] = useState("ALL");

  const categories = useMemo(() => {
    const cats = projects.map((p) => p.category).filter(Boolean);
    return ["ALL", ...Array.from(new Set(cats))];
  }, [projects]);

  const skills = useMemo(() => {
    const allSkills = projects.flatMap((p) => p.requiredSkills);
    return ["ALL", ...Array.from(new Set(allSkills))];
  }, [projects]);

  const filtered = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        search.trim() === "" ||
        project.title.toLowerCase().includes(search.toLowerCase()) ||
        project.description.toLowerCase().includes(search.toLowerCase()) ||
        project.requiredSkills.some((skill: string) =>
          skill.toLowerCase().includes(search.toLowerCase())
        );

      const matchesCategory =
        selectedCategory === "ALL" || project.category === selectedCategory;

      const matchesSkill =
        selectedSkill === "ALL" ||
        project.requiredSkills.includes(selectedSkill);

      return matchesSearch && matchesCategory && matchesSkill;
    });
  }, [projects, search, selectedCategory, selectedSkill]);

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by title, description or skill..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-xl px-4 py-2 w-full md:w-96 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "ALL" ? "All Categories" : cat}
            </option>
          ))}
        </select>
        <select
          value={selectedSkill}
          onChange={(e) => setSelectedSkill(e.target.value)}
          className="border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          {skills.map((skill) => (
            <option key={skill} value={skill}>
              {skill === "ALL" ? "All Skills" : skill}
            </option>
          ))}
        </select>
      </div>

      {/* Results Count */}
      <p
        style={{
          fontSize: 13,
          color: "var(--text-muted)",
          padding: "10px 0",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
          marginTop: 4,
        }}
      >
        Showing{" "}
        <span style={{ color: "#6366f1", fontWeight: 600 }}>
          {filtered.length}
        </span>{" "}
        of {projects.length} projects
      </p>

      {/* Project Grid */}
      {filtered.length === 0 ? (
        <div
          style={{
            background: "var(--surface)",
            border: "1px dashed var(--border)",
            borderRadius: 16,
            padding: 64,
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "var(--text-primary)",
              marginBottom: 8,
            }}
          >
            No projects found
          </p>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filtered.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}