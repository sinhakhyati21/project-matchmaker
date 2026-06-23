import { redirect } from "next/navigation";

import { auth } from "../../auth";
import { connectDB } from "../../lib/db";
import Project from "../../models/Project.model";
import Application from "../../models/Application.model";
import ApplicationActions from "../../components/ApplicationActions";
import ProjectStatusActions from "../../components/ProjectStatusActions";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/signin");
  }

  await connectDB();

  const projects = await Project.find({
    owner: session.user.id,
  }).sort({ createdAt: -1 });

  const applications = await Application.find({
    project: {
      $in: projects.map((project) => project._id),
    },
  })
    .populate("user", "name email githubUsername image skills status")
    .populate("project", "title")
    .sort({ createdAt: -1 });

  const safeProjects = JSON.parse(JSON.stringify(projects));
  const safeApplications = JSON.parse(JSON.stringify(applications));

  return (
    <div className="p-10 space-y-10">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-500 mt-2">
          Manage your projects and applications.
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-bold mb-4">My Projects</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {safeProjects.map((project: any) => (
            <div
              key={project._id}
              className="border rounded-xl p-5 shadow-sm"
            >
              <h3 className="text-xl font-bold">{project.title}</h3>

              <p className="text-gray-600 mt-2">
                {project.description}
              </p>

              <p className="text-sm text-gray-500 mt-3">
                Status: <b>{project.status || "RECRUITING"}</b>
              </p>
              <ProjectStatusActions
                projectId={project._id}
                currentStatus={project.status || "RECRUITING"}
              />
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">
          Applications Received
        </h2>

        <div className="space-y-4">
          {safeApplications.map((application: any) => (
            <div
              key={application._id}
              className="border rounded-xl p-5 shadow-sm flex justify-between gap-4"
            >
              <div>
                <h3 className="font-bold">
                  {application.user?.name || "Unknown User"}
                </h3>

                <p className="text-sm text-gray-500">
                  Applied for: {application.project?.title}
                </p>

                <p className="text-sm text-gray-500">
                  GitHub:{" "}
                  {application.user?.githubUsername || "Not available"}
                </p>

                <p className="text-sm mt-2">
                  Status: <b>{application.status}</b>
                </p>
              </div>

              <ApplicationActions
                applicationId={application._id}
                status={application.status}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}