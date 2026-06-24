"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function SkillsEditor({
  currentSkills,
}: {
  currentSkills: string[];
}) {
  const router = useRouter();
  const [skills, setSkills] = useState<string[]>(currentSkills);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function addSkill() {
    const trimmed = input.trim();
    if (!trimmed) return;
    if (skills.includes(trimmed)) {
      toast.error("Skill already added");
      setInput("");
      return;
    }

    const newSkills = [...skills, trimmed];
    setSkills(newSkills);
    setInput("");

    setLoading(true);
    const res = await fetch("/api/user/skills", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skills: newSkills }),
    });

    if (res.ok) {
      toast.success(`"${trimmed}" added!`);
      router.refresh();
    } else {
      toast.error("Failed to save skill");
      setSkills(skills);
    }
    setLoading(false);
  }

  async function removeSkill(skill: string) {
    const newSkills = skills.filter((s) => s !== skill);
    setSkills(newSkills);

    setLoading(true);
    const res = await fetch("/api/user/skills", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skills: newSkills }),
    });

    if (res.ok) {
      toast.success(`"${skill}" removed!`);
      router.refresh();
    } else {
      toast.error("Failed to remove skill");
      setSkills(skills);
    }
    setLoading(false);
  }

  return (
    <div>
      <h2
        style={{
          fontSize: 16,
          fontWeight: 700,
          color: "var(--text-primary)",
          marginBottom: 12,
        }}
      >
        My Skills
      </h2>

      {/* Skills Tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
        {skills.length === 0 && (
          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
            No skills added yet
          </p>
        )}
        {skills.map((skill) => (
          <span
            key={skill}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(99,102,241,0.1)",
              color: "#818cf8",
              border: "1px solid rgba(99,102,241,0.25)",
              padding: "4px 12px",
              borderRadius: 9999,
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            {skill}
            <button
              onClick={() => removeSkill(skill)}
              disabled={loading}
              style={{
                background: "none",
                border: "none",
                color: "#818cf8",
                cursor: "pointer",
                padding: 0,
                fontSize: 16,
                lineHeight: 1,
                opacity: loading ? 0.5 : 1,
                display: "flex",
                alignItems: "center",
              }}
            >
              ×
            </button>
          </span>
        ))}
      </div>

      {/* Add Skill Input */}
      <div style={{ display: "flex", gap: 8 }}>
        <input
          style={{
            flex: 1,
            background: "var(--background)",
            border: "1px solid var(--border)",
            color: "var(--text-primary)",
            borderRadius: 8,
            padding: "9px 14px",
            fontSize: 14,
            outline: "none",
          }}
          placeholder="Add a skill (e.g. React, Python) and press Enter"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addSkill();
            }
          }}
        />
        <button
          onClick={addSkill}
          disabled={loading}
          style={{
            background: "#6366f1",
            color: "white",
            border: "none",
            padding: "9px 20px",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
            whiteSpace: "nowrap",
          }}
        >
          {loading ? "Saving..." : "Add"}
        </button>
      </div>
    </div>
  );
}