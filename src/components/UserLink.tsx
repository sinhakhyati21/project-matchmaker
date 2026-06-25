"use client";

export default function UserLink({
  githubUsername,
  name,
  image,
  showImage = false,
}: {
  githubUsername?: string;
  name?: string;
  image?: string;
  showImage?: boolean;
}) {
  if (!githubUsername) {
    return (
      <span style={{ color: "var(--text-muted)", fontSize: 13 }}>
        {name || "Unknown"}
      </span>
    );
  }

  return (
    <span
      onClick={() => window.open(`/users/${githubUsername}`, "_blank")}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        cursor: "pointer",
        color: "#6366f1",
        fontSize: 13,
        fontWeight: 500,
        textDecoration: "none",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.textDecoration = "underline";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.textDecoration = "none";
      }}
    >
      {showImage && image && (
        <img
          src={image}
          alt={name || githubUsername}
          style={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            border: "1px solid var(--border)",
          }}
        />
      )}
      {name || `@${githubUsername}`}
    </span>
  );
}