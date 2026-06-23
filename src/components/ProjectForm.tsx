"use client";

import { useState } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function ProjectForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [skills, setSkills] = useState("");
  const [roles, setRoles] = useState("");
  const [teamSize, setTeamSize] = useState(2);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/projects", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          title,
          description,
          category,
          requiredSkills: skills
            .split(",")
            .map((s) => s.trim()),

          requiredRoles: roles
            .split(",")
            .map((r) => r.trim()),

          maxTeamSize: teamSize,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Project created!");

        setTitle("");
        setDescription("");
        setCategory("");
        setSkills("");
        setRoles("");
        setTeamSize(2);
      } else {
        setError(data.error || data.message || "Failed to create project");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
  <form
    onSubmit={handleSubmit}
    className="space-y-6 max-w-xl"
  >
    <div className="space-y-2">
      <label className="text-sm font-medium">
        Title
      </label>

      <Input
        placeholder="Enter project title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
    </div>

    <div className="space-y-2">
      <label className="text-sm font-medium">
        Description
      </label>

      <Textarea
        placeholder="Describe your project"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
    </div>

    <div className="space-y-2">
      <label className="text-sm font-medium">
        Category
      </label>

      <Input
        placeholder="Web Dev, AI, Blockchain..."
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
    </div>

    <div className="space-y-2">
      <label className="text-sm font-medium">
        Required Skills
      </label>

      <Input
        placeholder="React, Node.js, MongoDB"
        value={skills}
        onChange={(e) => setSkills(e.target.value)}
      />
    </div>

    <div className="space-y-2">
      <label className="text-sm font-medium">
        Required Roles
      </label>

      <Input
        placeholder="Frontend Developer, Backend Developer"
        value={roles}
        onChange={(e) => setRoles(e.target.value)}
      />
    </div>

    <div className="space-y-2">
      <label className="text-sm font-medium">
        Maximum Team Size
      </label>

      <Input
        type="number"
        min={1}
        value={teamSize}
        onChange={(e) =>
          setTeamSize(Number(e.target.value))
        }
      />
    </div>

    <Button type="submit">
      Create Project
    </Button>
  </form>
);
}