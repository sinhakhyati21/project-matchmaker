import { connectDB } from "../../lib/db";
import Project from "../../models/Project.model";
import ProjectsClient from "../../components/ProjectsClient";

export default async function ProjectsPage() {
  await connectDB();

  const projects = await Project.find({ status: "RECRUITING" })
    .populate("owner", "name githubUsername image")
    .sort({ createdAt: -1 });

  const safeProjects = JSON.parse(JSON.stringify(projects));

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px" }}>

      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <h1
          style={{
            fontSize: 36,
            fontWeight: 800,
            color: "var(--text-primary)",
            marginBottom: 10,
            letterSpacing: "-0.02em",
          }}
        >
          Browse Projects
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: 15, maxWidth: 500 }}>
          Find hackathon teams, startup ideas and open-source projects looking
          for contributors like you.
        </p>
      </div>

      {/* Divider */}
      <div
        style={{
          height: 1,
          background: "var(--border)",
          marginBottom: 32,
        }}
      />

      <ProjectsClient projects={safeProjects} />
    </div>
  );
}