import { redirect } from "next/navigation";
import { auth } from "../../../auth";
import { connectDB } from "../../../lib/db";
import Hub from "../../../models/Hub.model";
import "../../../models/Project.model";
import "../../../models/User.model";
import Task from "../../../models/Task.model";
import Resource from "../../../models/Resource.model";
import Message from "../../../models/Message.model";
import Review from "../../../models/Review.model";
import Discussion from "../../../models/Discussion.model";
import Expense from "../../../models/Expense.model";
import HubTabs from "../../../components/HubTabs";

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

  const hub = await Hub.findOne({ project: projectId })
    .populate("project", "title description status")
    .populate("members", "name email githubUsername image status");

  if (!hub) {
    return (
      <div className="p-10">
        <h1 className="text-3xl font-bold">Hub Not Found</h1>
        <p className="text-gray-500 mt-2">
          This project does not have a team hub yet. At least 2 members need to
          join before the hub is created.
        </p>
      </div>
    );
  }

  const isMember = hub.members.some(
    (member: any) => member._id.toString() === session.user.id
  );

  if (!isMember) {
    redirect("/dashboard");
  }

  const [tasks, resources, messages, reviews, discussions, expenses] =
    await Promise.all([
      Task.find({ hub: hub._id }).sort({ createdAt: -1 }),
      Resource.find({ hub: hub._id }).sort({ createdAt: -1 }),
      Message.find({ hub: hub._id })
        .populate("sender", "name githubUsername image")
        .sort({ createdAt: 1 }),
      Review.find({ project: projectId })
        .populate("reviewer", "name githubUsername image")
        .populate("reviewee", "name githubUsername image")
        .sort({ createdAt: -1 }),
      Discussion.find({ hub: hub._id })
        .populate("author", "name githubUsername image")
        .populate("replies.author", "name githubUsername image")
        .sort({ createdAt: -1 }),
      Expense.find({ hub: hub._id })
        .populate("paidBy", "name githubUsername image")
        .sort({ createdAt: -1 }),
    ]);

  const safeHub = JSON.parse(JSON.stringify(hub));
  const safeTasks = JSON.parse(JSON.stringify(tasks));
  const safeResources = JSON.parse(JSON.stringify(resources));
  const safeMessages = JSON.parse(JSON.stringify(messages));
  const safeReviews = JSON.parse(JSON.stringify(reviews));
  const safeDiscussions = JSON.parse(JSON.stringify(discussions));
  const safeExpenses = JSON.parse(JSON.stringify(expenses));

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">{safeHub.project?.title} — Hub</h1>
        <p className="text-gray-500 mt-1">{safeHub.project?.description}</p>
        <span className="inline-block mt-2 text-xs font-semibold px-3 py-1 rounded-full bg-indigo-100 text-indigo-700">
          {safeHub.project?.status}
        </span>
      </div>

      <HubTabs
        hub={safeHub}
        tasks={safeTasks}
        resources={safeResources}
        messages={safeMessages}
        reviews={safeReviews}
        discussions={safeDiscussions}
        expenses={safeExpenses}
        currentUserId={session.user.id}
      />
    </div>
  );
}