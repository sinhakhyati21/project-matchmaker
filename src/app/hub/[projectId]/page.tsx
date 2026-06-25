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

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  RECRUITING: { bg: "rgba(34,197,94,0.15)", color: "#4ade80" },
  ACTIVE: { bg: "rgba(99,102,241,0.15)", color: "#818cf8" },
  COMPLETED: { bg: "rgba(245,158,11,0.15)", color: "#fbbf24" },
  ARCHIVED: { bg: "rgba(161,161,170,0.15)", color: "#a1a1aa" },
};

export default async function HubPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const session = await auth();
  if (!session || !require("mongoose").Types.ObjectId.isValid(session.user.id)) {
    redirect("/signin");
  }

  const { projectId } = await params;
  await connectDB();

  const hub = await Hub.findOne({ project: projectId })
    .populate("project", "title description status")
    .populate("members", "name email githubUsername image status");

  if (!hub) {
    return (
      <div
        style={{
          maxWidth: 600,
          margin: "80px auto",
          padding: "0 24px",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: 48, marginBottom: 16 }}>🔒</p>
        <h1
          style={{
            fontSize: 24,
            fontWeight: 800,
            color: "var(--text-primary)",
            marginBottom: 8,
          }}
        >
          Hub Not Found
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: 15 }}>
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

  const status = safeHub.project?.status || "ACTIVE";
  const statusStyle = STATUS_COLORS[status] || STATUS_COLORS.ACTIVE;

  return (
    <div
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "40px 32px",
      }}
    >
      {/* Header */}
      <div
        style={{
          marginBottom: 32,
          paddingBottom: 24,
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 8,
          }}
        >
          <h1
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: "var(--text-primary)",
            }}
          >
            {safeHub.project?.title}
          </h1>
          <span
            style={{
              background: statusStyle.bg,
              color: statusStyle.color,
              padding: "3px 12px",
              borderRadius: 9999,
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {status}
          </span>
        </div>
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
          {safeHub.project?.description}
        </p>
        <p
          style={{
            color: "var(--text-muted)",
            fontSize: 13,
            marginTop: 8,
          }}
        >
          {safeHub.members?.length} member
          {safeHub.members?.length !== 1 ? "s" : ""} · {safeTasks.length} tasks
          · {safeMessages.length} messages
        </p>
      </div>

      {/* Tabs */}
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