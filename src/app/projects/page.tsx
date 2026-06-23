import { connectDB } from "../../lib/db";
import Project from "../../models/Project.model";
import ProjectCard from "../../components/ProjectCard";

export default async function ProjectsPage() {
  await connectDB();

  const projects = await Project.find({
    status: "RECRUITING",
  })
    .populate("owner", "name githubUsername image")
    .sort({ createdAt: -1 });

  const safeProjects = JSON.parse(JSON.stringify(projects));

  return (
    <div className="p-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Browse Projects</h1>
        <p className="text-gray-500 mt-2">
          Find hackathon teams, startup ideas and open-source projects.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {safeProjects.map((project: any) => (
          <ProjectCard key={project._id} project={project} />
        ))}
      </div>
    </div>
  );
}