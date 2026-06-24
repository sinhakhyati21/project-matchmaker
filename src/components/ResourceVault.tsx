"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type Resource = {
  _id: string;
  title: string;
  url: string;
  type: string;
};

const TYPE_ICONS: Record<string, string> = {
  GITHUB: "⌥",
  DESIGN: "✦",
  DOCS: "☰",
  PRESENTATION: "◈",
  OTHER: "○",
};

export default function ResourceVault({
  hubId,
  projectId,
  resources,
}: {
  hubId: string;
  projectId: string;
  resources: Resource[];
}) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [type, setType] = useState("OTHER");
  const [loading, setLoading] = useState(false);

  async function createResource(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !url) {
      toast.error("Title and URL are required");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/resources", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hubId, projectId, title, url, type }),
    });

    if (res.ok) {
      toast.success("Resource added!");
      setTitle("");
      setUrl("");
      setType("OTHER");
      router.refresh();
    } else {
      const data = await res.json();
      toast.error(data.message || "Failed to add resource");
    }
    setLoading(false);
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
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Add Resource Form */}
      <form
        onSubmit={createResource}
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          padding: "20px 24px",
          display: "flex",
          flexDirection: "column" as const,
          gap: 12,
        }}
      >
        <h3
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: "var(--text-primary)",
            marginBottom: 4,
          }}
        >
          Add Resource
        </h3>

        <input
          style={inputStyle}
          placeholder="Resource title (e.g. GitHub Repo, Figma Design)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          style={inputStyle}
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={{
            ...inputStyle,
            cursor: "pointer",
            appearance: "auto" as const,
          }}
        >
          <option value="GITHUB">GitHub</option>
          <option value="DESIGN">Design</option>
          <option value="DOCS">Docs</option>
          <option value="PRESENTATION">Presentation</option>
          <option value="OTHER">Other</option>
        </select>

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
          {loading ? "Adding..." : "Add Resource"}
        </button>
      </form>

      {/* Resource List */}
      {resources.length === 0 ? (
        <div
          style={{
            background: "var(--surface)",
            border: "1px dashed var(--border)",
            borderRadius: 12,
            padding: 32,
            textAlign: "center",
          }}
        >
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
            No resources added yet. Add your GitHub repo, design files, or docs.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 12,
          }}
        >
          {resources.map((resource) => {
            return (
              <div
                key={resource._id}
                onClick={() => window.open(resource.url, "_blank")}
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  padding: "16px 18px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  display: "flex",
                  flexDirection: "column" as const,
                  gap: 6,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#6366f1";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 2,
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: "#818cf8",
                      background: "rgba(99,102,241,0.1)",
                      border: "1px solid rgba(99,102,241,0.2)",
                      padding: "2px 8px",
                      borderRadius: 4,
                      letterSpacing: "0.05em",
                    }}
                  >
                    {resource.type}
                  </span>
                </div>
                <h3
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "var(--text-primary)",
                  }}
                >
                  {resource.title}
                </h3>
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--text-muted)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {resource.url}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}