import { redirect } from "next/navigation";
import { auth } from "../../../auth";
import { connectDB } from "../../../lib/db";
import Project from "../../../models/Project.model";
import EditProjectForm from "../../../components/EditProjectForm";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session) {
    redirect("/signin");
  }

  const { id } = await params;
  await connectDB();

  const project = await Project.findById(id);
  if (!project) {
    redirect("/dashboard");
  }

  if (project.owner.toString() !== session.user.id) {
    redirect("/dashboard");
  }

  if (project.status === "ACTIVE" || project.status === "COMPLETED") {
    redirect("/dashboard");
  }

  const safeProject = JSON.parse(JSON.stringify(project));

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            fontSize: 32,
            fontWeight: 800,
            color: "var(--text-primary)",
            marginBottom: 8,
          }}
        >
          Edit Project
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: 15 }}>
          Update your project details. You can only edit projects that are
          Recruiting or Archived.
        </p>
      </div>
      <EditProjectForm project={safeProject} />
    </div>
  );
}