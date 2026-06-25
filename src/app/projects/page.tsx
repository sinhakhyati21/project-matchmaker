import { connectDB } from "../../lib/db";
import Project from "../../models/Project.model";
import ProjectsClient from "../../components/ProjectsClient";
import { auth } from "../../auth";
import Application from "../../models/Application.model";

export default async function ProjectsPage() {
  await connectDB();

  const session = await auth();

  const projects = await Project.find({ status: "RECRUITING" })
    .populate("owner", "name githubUsername image")
    .sort({ createdAt: -1 });

  let filteredProjects = JSON.parse(JSON.stringify(projects));

  if (session) {
    // Get projects user already applied to
    const applications = await Application.find({
      user: session.user.id,
    }).select("project");

    const appliedProjectIds = new Set(
      applications.map((a) => a.project.toString())
    );

    // Remove projects user owns or already applied to
    filteredProjects = filteredProjects.filter((p: any) => {
      const isOwner =
        p.owner?._id?.toString() === session.user.id ||
        p.owner === session.user.id;
      const alreadyApplied = appliedProjectIds.has(p._id.toString());
      return !isOwner && !alreadyApplied;
    });
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px" }}>
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

      <div style={{ height: 1, background: "var(--border)", marginBottom: 32 }} />

      <ProjectsClient projects={filteredProjects} />
    </div>
  );
}