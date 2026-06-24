import Link from "next/link";
import { auth } from "../auth";

export default async function Home() {
  const session = await auth();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section
        style={{
          background:
            "radial-gradient(ellipse at top, rgba(99,102,241,0.15) 0%, transparent 60%), var(--background)",
          padding: "120px 24px 80px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 700, margin: "0 auto" }}>

          <h1
            style={{
              fontSize: "clamp(2.5rem, 6vw, 4rem)",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: "var(--text-primary)",
              marginBottom: 24,
            }}
          >
            Find Your Perfect{" "}
            <span style={{ color: "#6366f1" }}>Hackathon Team</span>
          </h1>

          <p
            style={{
              fontSize: 18,
              color: "var(--text-muted)",
              lineHeight: 1.6,
              marginBottom: 40,
              maxWidth: 520,
              margin: "0 auto 40px",
            }}
          >
            Create a project, get AI-matched with teammates based on skills and
            GitHub activity, and collaborate in a private Hub.
          </p>

          <div
            style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}
          >
            <Link
              href="/projects"
              style={{
                background: "#6366f1",
                color: "white",
                padding: "12px 28px",
                borderRadius: 10,
                fontWeight: 600,
                fontSize: 15,
                textDecoration: "none",
                transition: "all 0.2s",
              }}
            >
              Browse Projects
            </Link>
            {!session ? (
              <Link
                href="/signin"
                style={{
                  background: "transparent",
                  color: "var(--text-primary)",
                  padding: "12px 28px",
                  borderRadius: 10,
                  fontWeight: 600,
                  fontSize: 15,
                  border: "1px solid var(--border)",
                  textDecoration: "none",
                }}
              >
                Sign in with GitHub
              </Link>
            ) : (
              <Link
                href="/create-project"
                style={{
                  background: "transparent",
                  color: "var(--text-primary)",
                  padding: "12px 28px",
                  borderRadius: 10,
                  fontWeight: 600,
                  fontSize: 15,
                  border: "1px solid var(--border)",
                  textDecoration: "none",
                }}
              >
                Create a Project
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section
        style={{
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
          padding: "24px",
          background: "var(--surface)",
        }}
      >
        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
            textAlign: "center",
          }}
        >
          {[
            { label: "Active Projects", value: "100+" },
            { label: "Team Matches Made", value: "500+" },
            { label: "Trust Reviews", value: "200+" },
          ].map((stat) => (
            <div key={stat.label}>
              <p
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  color: "#6366f1",
                }}
              >
                {stat.value}
              </p>
              <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "80px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <h2
          style={{
            fontSize: 32,
            fontWeight: 800,
            textAlign: "center",
            marginBottom: 48,
            color: "var(--text-primary)",
          }}
        >
          Everything your team needs
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 24,
          }}
        >
          {[
            {
              icon: "🤖",
              title: "AI Team Matching",
              desc: "Get ranked candidates based on skill match, GitHub activity score, and trust score. See the breakdown for every recommendation.",
              color: "rgba(99,102,241,0.1)",
              border: "rgba(99,102,241,0.3)",
            },
            {
              icon: "🏠",
              title: "Private Team Hub",
              desc: "Real-time SSE chat with typing indicator, drag-and-drop Kanban board, discussion threads, resource vault, and expense tracker.",
              color: "rgba(34,211,238,0.1)",
              border: "rgba(34,211,238,0.3)",
            },
            {
              icon: "⭐",
              title: "Trust Score",
              desc: "Build your reputation through peer reviews after every completed project. Scores are shown on every profile and recommendation.",
              color: "rgba(245,158,11,0.1)",
              border: "rgba(245,158,11,0.3)",
            },
            {
              icon: "📊",
              title: "GitHub Integration",
              desc: "Your GitHub contribution graph and public repos are shown on your profile so teammates can see if you actually write code.",
              color: "rgba(34,197,94,0.1)",
              border: "rgba(34,197,94,0.3)",
            },
            {
              icon: "📋",
              title: "Kanban Board",
              desc: "Drag and drop tasks between To Do, In Progress, Review, and Done — all inside your Hub without leaving the app.",
              color: "rgba(239,68,68,0.1)",
              border: "rgba(239,68,68,0.3)",
            },
            {
              icon: "💬",
              title: "Real-time Chat",
              desc: "Instant team messaging powered by Server-Sent Events. No page refresh needed. Share images and see typing indicators.",
              color: "rgba(168,85,247,0.1)",
              border: "rgba(168,85,247,0.3)",
            },
          ].map((f) => (
            <div
              key={f.title}
              style={{
                background: f.color,
                border: `1px solid ${f.border}`,
                borderRadius: 16,
                padding: 24,
              }}
            >
              <div style={{ fontSize: 36, marginBottom: 16 }}>{f.icon}</div>
              <h3
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  marginBottom: 8,
                  color: "var(--text-primary)",
                }}
              >
                {f.title}
              </h3>
              <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section
        style={{
          padding: "80px 24px",
          background: "var(--surface)",
          borderTop: "1px solid var(--border)",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2
            style={{
              fontSize: 32,
              fontWeight: 800,
              textAlign: "center",
              marginBottom: 48,
              color: "var(--text-primary)",
            }}
          >
            How it works
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 32,
              textAlign: "center",
            }}
          >
            {[
              {
                step: "1",
                title: "Create a Project",
                desc: "Add your idea, required skills, roles, and team size.",
              },
              {
                step: "2",
                title: "Get AI Matches",
                desc: "Our AI ranks candidates by skill fit, GitHub activity, and trust score.",
              },
              {
                step: "3",
                title: "Send Invitations",
                desc: "Invite the best candidates directly from the recommendations panel.",
              },
              {
                step: "4",
                title: "Build Together",
                desc: "Your private Hub opens automatically. Chat, plan, and ship.",
              },
            ].map((s) => (
              <div key={s.step}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    background: "#6366f1",
                    color: "white",
                    fontSize: 20,
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px",
                    boxShadow: "0 0 20px rgba(99,102,241,0.4)",
                  }}
                >
                  {s.step}
                </div>
                <h3
                  style={{
                    fontWeight: 700,
                    fontSize: 16,
                    marginBottom: 8,
                    color: "var(--text-primary)",
                  }}
                >
                  {s.title}
                </h3>
                <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6 }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          padding: "80px 24px",
          textAlign: "center",
          background:
            "radial-gradient(ellipse at center, rgba(99,102,241,0.1) 0%, transparent 70%)",
        }}
      >
        <h2
          style={{
            fontSize: 32,
            fontWeight: 800,
            color: "var(--text-primary)",
            marginBottom: 16,
          }}
        >
          Ready to find your team?
        </h2>
        <p
          style={{
            color: "var(--text-muted)",
            marginBottom: 32,
            fontSize: 16,
          }}
        >
          Join hundreds of builders already using Project Matchmaker.
        </p>
        <Link
          href={session ? "/create-project" : "/signin"}
          style={{
            background: "#6366f1",
            color: "white",
            padding: "14px 36px",
            borderRadius: 10,
            fontWeight: 700,
            fontSize: 16,
            textDecoration: "none",
            boxShadow: "0 0 30px rgba(99,102,241,0.4)",
          }}
        >
          {session ? "Create a Project" : "Get Started Free"}
        </Link>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid var(--border)",
          padding: "24px",
          textAlign: "center",
          color: "var(--text-muted)",
          fontSize: 13,
        }}
      >
        Project Matchmaker · Built with Next.js 14 + TypeScript + MongoDB
      </footer>
    </div>
  );
}