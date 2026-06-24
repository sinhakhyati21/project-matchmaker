import SignInButton from "../../components/SignInButton";

export default function SignInPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(ellipse at top, rgba(99,102,241,0.1) 0%, transparent 60%), var(--background)",
        padding: "24px",
      }}
    >
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 20,
          padding: "48px 40px",
          maxWidth: 420,
          width: "100%",
          textAlign: "center",
        }}
      >
        {/* Logo */}
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            background: "#6366f1",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
            fontSize: 22,
            fontWeight: 800,
            color: "white",
          }}
        >
          PM
        </div>

        <h1
          style={{
            fontSize: 24,
            fontWeight: 800,
            color: "var(--text-primary)",
            marginBottom: 8,
          }}
        >
          Welcome to Project Matchmaker
        </h1>
        <p
          style={{
            fontSize: 14,
            color: "var(--text-muted)",
            marginBottom: 32,
            lineHeight: 1.6,
          }}
        >
          Sign in with your GitHub account to create projects, find teammates,
          and collaborate.
        </p>

        <SignInButton />

        <p
          style={{
            fontSize: 12,
            color: "var(--text-muted)",
            marginTop: 24,
            lineHeight: 1.6,
          }}
        >
          By signing in, you agree to our terms of service. We only request
          read access to your public GitHub profile.
        </p>
      </div>
    </div>
  );
}