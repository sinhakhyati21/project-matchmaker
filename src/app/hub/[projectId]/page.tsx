import { redirect } from "next/navigation";

import { auth } from "../../../auth";
import { connectDB } from "../../../lib/db";

import Hub from "../../../models/Hub.model";
import "../../../models/Project.model";
import "../../../models/User.model";

import Task from "../../../models/Task.model";
import Resource from "../../../models/Resource.model";

import KanbanBoard from "../../../components/KanbanBoard";
import CreateTaskForm from "../../../components/CreateTaskForm";
import ResourceVault from "../../../components/ResourceVault";

export default async function HubPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const session = await auth();

  if (!session) {
    redirect("/signin");
  }

  const { projectId } = await params;

  await connectDB();

  const hub = await Hub.findOne({
    project: projectId,
  })
    .populate("project", "title description status")
    .populate(
      "members",
      "name email githubUsername image status"
    );

  if (!hub) {
    return (
      <div className="p-10">
        <h1 className="text-3xl font-bold">
          Hub Not Found
        </h1>

        <p className="text-gray-500 mt-2">
          This project does not have a team hub yet.
        </p>
      </div>
    );
  }

  const isMember = hub.members.some(
    (member: any) =>
      member._id.toString() === session.user.id
  );

  if (!isMember && process.env.NODE_ENV !== "development") {
    redirect("/dashboard");
  }

  const tasks = await Task.find({
    hub: hub._id,
  }).sort({ createdAt: -1 });

  const resources = await Resource.find({
    hub: hub._id,
  }).sort({ createdAt: -1 });

  const safeHub = JSON.parse(JSON.stringify(hub));
  const safeTasks = JSON.parse(JSON.stringify(tasks));
  const safeResources = JSON.parse(
    JSON.stringify(resources)
  );

  return (
    <div className="p-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          {safeHub.project?.title} Hub
        </h1>

        <p className="text-gray-500 mt-2">
          {safeHub.project?.description}
        </p>

        <p className="text-sm mt-2">
          Project Status:{" "}
          <b>{safeHub.project?.status}</b>
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-bold mb-4">
          Team Members
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          {safeHub.members.map(
            (member: any, index: number) => (
              <div
                key={`${member._id}-${index}`}
                className="border rounded-xl p-4 flex gap-4 items-center"
              >
                {member.image && (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-12 h-12 rounded-full"
                  />
                )}

                <div>
                  <h3 className="font-bold">
                    {member.name}
                  </h3>

                  <p className="text-sm text-gray-500">
                    @{member.githubUsername || "github"}
                  </p>

                  <p className="text-sm">
                    {member.status?.replaceAll("_", " ")}
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">
          Create Task
        </h2>

        <CreateTaskForm
          hubId={safeHub._id}
          projectId={safeHub.project._id}
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">
          Kanban Board
        </h2>

        <KanbanBoard tasks={safeTasks} />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">
          Resource Vault
        </h2>

        <ResourceVault
          hubId={safeHub._id}
          projectId={safeHub.project._id}
          resources={safeResources}
        />
      </section>

      <section className="border rounded-xl p-5">
        <h3 className="font-bold">Team Chat</h3>
        <p className="text-sm text-gray-500 mt-2">
          Coming next.
        </p>
      </section>
    </div>
  );
}