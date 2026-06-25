export default function NotFound() {
  return (
    <div
      style={{
        maxWidth: 480,
        margin: "80px auto",
        padding: "0 24px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          padding: "40px 32px",
        }}
      >
        <p
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: "#6366f1",
            lineHeight: 1,
            marginBottom: 16,
          }}
        >
          404
        </p>
        <h2
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: "var(--text-primary)",
            marginBottom: 8,
          }}
        >
          Page not found
        </h2>
        <p
          style={{
            fontSize: 14,
            color: "var(--text-muted)",
            lineHeight: 1.6,
            marginBottom: 24,
          }}
        >
          The page you are looking for does not exist or has been moved.
        </p>
        
        <a  href="/"
          style={{
            background: "#6366f1",
            color: "white",
            padding: "10px 24px",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            textDecoration: "none",
            display: "block",
          }}
        >
          Go Home
        </a>
      </div>
    </div>
  );
}