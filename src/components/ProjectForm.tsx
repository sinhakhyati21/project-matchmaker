"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const CATEGORIES = [
  "Web Development",
  "Mobile App",
  "AI / ML",
  "Blockchain",
  "Game Dev",
  "Data Science",
  "DevTools",
  "Open Source",
  "Research",
  "Other",
];

export default function ProjectForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [skills, setSkills] = useState("");
  const [roles, setRoles] = useState("");
  const [teamSize, setTeamSize] = useState(2);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const finalCategory =
      category === "Other" ? customCategory.trim() : category;

    if (!title.trim()) { toast.error("Title is required"); return; }
    if (!description.trim()) { toast.error("Description is required"); return; }
    if (!finalCategory) { toast.error("Category is required"); return; }
    if (!skills.trim()) { toast.error("Required skills are required"); return; }

    setLoading(true);
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          category: finalCategory,
          requiredSkills: skills
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean),
          requiredRoles: roles
            .split(",")
            .map((r: string) => r.trim())
            .filter(Boolean),
          maxTeamSize: teamSize,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Project created successfully!");
        router.push("/dashboard");
      } else {
        toast.error(data.error || data.message || "Failed to create project");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  const labelStyle = {
    fontSize: 13,
    fontWeight: 600,
    color: "var(--text-primary)",
    marginBottom: 6,
    display: "block" as const,
  };

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

  const hintStyle = {
    fontSize: 12,
    color: "var(--text-muted)",
    marginTop: 4,
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 16,
        padding: 32,
        display: "flex",
        flexDirection: "column" as const,
        gap: 24,
      }}
    >
      {/* Title */}
      <div>
        <label style={labelStyle}>Project Title *</label>
        <input
          style={inputStyle}
          placeholder="e.g. AI-powered Resume Builder"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* Description */}
      <div>
        <label style={labelStyle}>Description *</label>
        <textarea
          style={{
            ...inputStyle,
            minHeight: 100,
            resize: "vertical" as const,
          }}
          placeholder="Describe your project idea, goals, and what you are building..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Category */}
      <div>
        <label style={labelStyle}>Category *</label>
        <select
          value={category}
          onChange={(e) => {
            const val = e.target.value;
            setCategory(val);
            if (val !== "Other") setCustomCategory("");
          }}
          style={{
            width: "100%",
            background: "var(--background)",
            border: "1px solid var(--border)",
            color: "var(--text-primary)",
            borderRadius: 8,
            padding: "10px 14px",
            fontSize: 14,
            outline: "none",
            cursor: "pointer",
            appearance: "auto" as const,
          }}
        >
          <option value="">Select a category</option>
          {CATEGORIES.map((cat) => (
            <option
              key={cat}
              value={cat}
              style={{
                background: "var(--background)",
                color: "var(--text-primary)",
              }}
            >
              {cat}
            </option>
          ))}
        </select>

        {category === "Other" && (
          <input
            style={{
              ...inputStyle,
              marginTop: 8,
              border: "1px solid #6366f1",
            }}
            placeholder="e.g. AR/VR, IoT, Cybersecurity..."
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            autoFocus
          />
        )}
      </div>

      {/* Required Skills */}
      <div>
        <label style={labelStyle}>Required Skills *</label>
        <input
          style={inputStyle}
          placeholder="React, Node.js, MongoDB, Python..."
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
        />
        <p style={hintStyle}>Separate skills with commas</p>
      </div>

      {/* Required Roles */}
      <div>
        <label style={labelStyle}>Required Roles</label>
        <input
          style={inputStyle}
          placeholder="Frontend Developer, Backend Developer, Designer..."
          value={roles}
          onChange={(e) => setRoles(e.target.value)}
        />
        <p style={hintStyle}>Separate roles with commas</p>
      </div>

      {/* Team Size */}
      <div>
        <label style={labelStyle}>Maximum Team Size *</label>
        <input
          type="number"
          min={2}
          max={20}
          style={{ ...inputStyle, width: 120 }}
          value={teamSize}
          onChange={(e) => setTeamSize(Number(e.target.value))}
        />
        <p style={hintStyle}>Minimum 2, maximum 20</p>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        style={{
          background: loading ? "var(--border)" : "#6366f1",
          color: "white",
          border: "none",
          padding: "12px 24px",
          borderRadius: 10,
          fontSize: 15,
          fontWeight: 700,
          cursor: loading ? "not-allowed" : "pointer",
          transition: "all 0.2s",
          alignSelf: "flex-start" as const,
        }}
      >
        {loading ? "Creating..." : "Create Project"}
      </button>
    </form>
  );
}