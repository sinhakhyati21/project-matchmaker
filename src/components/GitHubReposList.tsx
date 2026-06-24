"use client";

type Repo = {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
};

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f7df1e",
  Python: "#3572A5",
  Rust: "#dea584",
  Go: "#00ADD8",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  Ruby: "#701516",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
};

export default function GitHubReposList({ repos }: { repos: Repo[] }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: 12,
      }}
    >
      {repos.map((repo) => {
        const langColor = repo.language
          ? LANGUAGE_COLORS[repo.language] || "#6366f1"
          : "#a1a1aa";

        return (
          <div
            key={repo.id}
            onClick={() => window.open(repo.html_url, "_blank")}
            style={{
              background: "var(--background)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              padding: 16,
              cursor: "pointer",
              transition: "all 0.2s",
              display: "flex",
              flexDirection: "column",
              gap: 8,
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
            {/* Repo Name */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 16 }}>📁</span>
              <h3
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#818cf8",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {repo.name}
              </h3>
            </div>

            {/* Description */}
            <p
              style={{
                fontSize: 12,
                color: "var(--text-muted)",
                lineHeight: 1.5,
                flex: 1,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {repo.description || "No description provided"}
            </p>

            {/* Footer */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 4,
              }}
            >
              {/* Language */}
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: langColor,
                    display: "inline-block",
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  {repo.language || "Unknown"}
                </span>
              </div>

              {/* Stars */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 12,
                  color: "var(--text-muted)",
                }}
              >
                <span>⭐</span>
                <span>{repo.stargazers_count}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}