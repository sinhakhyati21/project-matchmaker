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

  function addSkill() {
    const trimmed = input.trim();
    if (!trimmed) return;
    if (skills.includes(trimmed)) {
      toast.error("Skill already added");
      setInput("");
      return;
    }
    setSkills([...skills, trimmed]);
    setInput("");
  }

  function removeSkill(skill: string) {
    setSkills(skills.filter((s) => s !== skill));
  }

  async function saveSkills() {
    setLoading(true);
    const res = await fetch("/api/user/skills", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skills }),
    });

    if (res.ok) {
      toast.success("Skills saved!");
      router.refresh();
    } else {
      toast.error("Failed to save skills");
    }
    setLoading(false);
  }

  return (
    <section className="border rounded-xl p-5 space-y-4">
      <h2 className="text-2xl font-bold">My Skills</h2>

      {/* Skills Tags */}
      <div className="flex flex-wrap gap-2">
        {skills.length === 0 && (
          <p className="text-gray-400 text-sm">No skills added yet</p>
        )}
        {skills.map((skill) => (
          <span
            key={skill}
            className="flex items-center gap-1 bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm"
          >
            {skill}
            <button
              onClick={() => removeSkill(skill)}
              className="ml-1 text-indigo-400 hover:text-red-500 font-bold"
            >
              ×
            </button>
          </span>
        ))}
      </div>

      {/* Add Skill Input */}
      <div className="flex gap-2">
        <input
          className="border rounded-lg px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          placeholder="Add a skill (e.g. React, Python)"
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
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Add
        </button>
      </div>

      {/* Save Button */}
      <button
        onClick={saveSkills}
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded-lg disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save Skills"}
      </button>
    </section>
  );
}