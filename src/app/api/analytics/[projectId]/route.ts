import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { connectDB } from "../../../../lib/db";
import Hub from "../../../../models/Hub.model";
import Task from "../../../../models/Task.model";
import Message from "../../../../models/Message.model";
import Expense from "../../../../models/Expense.model";
import User from "../../../../models/User.model";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { projectId } = await params;
    await connectDB();

    const hub = await Hub.findOne({ project: projectId });
    if (!hub) {
      return NextResponse.json({ message: "Hub not found" }, { status: 404 });
    }

    const isMember = hub.members.some(
      (m: any) => m.toString() === session.user.id
    );
    if (!isMember) {
      return NextResponse.json({ message: "Not allowed" }, { status: 403 });
    }

    // Tasks analytics
    const tasks = await Task.find({ hub: hub._id });
    const taskStats = {
      total: tasks.length,
      todo: tasks.filter((t) => t.status === "TODO").length,
      inProgress: tasks.filter((t) => t.status === "IN_PROGRESS").length,
      review: tasks.filter((t) => t.status === "REVIEW").length,
      done: tasks.filter((t) => t.status === "DONE").length,
      completionRate:
        tasks.length > 0
          ? Math.round(
              (tasks.filter((t) => t.status === "DONE").length /
                tasks.length) *
                100
            )
          : 0,
    };

    // Messages analytics
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentMessages = await Message.countDocuments({
      hub: hub._id,
      createdAt: { $gte: sevenDaysAgo },
    });
    const totalMessages = await Message.countDocuments({ hub: hub._id });

    // Expense analytics with trends
    const expenses = await Expense.find({ hub: hub._id }).sort({
      createdAt: 1,
    });
    const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

    // Group expenses by date
    const expenseTrends: Record<string, number> = {};
    expenses.forEach((expense) => {
      const date = new Date(expense.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      });
      expenseTrends[date] = (expenseTrends[date] || 0) + expense.amount;
    });

    const expenseTrendArray = Object.entries(expenseTrends).map(
      ([date, amount]) => ({ date, amount })
    );

    // Member GitHub activity (contribution stats)
    const members = await User.find({ _id: { $in: hub.members } }).select(
      "name githubUsername image"
    );

    const memberActivity = await Promise.all(
      members.map(async (member) => {
        if (!member.githubUsername) {
          return {
            name: member.name,
            githubUsername: member.githubUsername,
            image: member.image,
            recentEvents: 0,
          };
        }
        try {
          const res = await fetch(
            `https://api.github.com/users/${member.githubUsername}/events?per_page=30`,
            {
              headers: { Accept: "application/vnd.github.v3+json" },
              next: { revalidate: 3600 },
            }
          );
          if (!res.ok) {
            return {
              name: member.name,
              githubUsername: member.githubUsername,
              image: member.image,
              recentEvents: 0,
            };
          }
          const events = await res.json();
          return {
            name: member.name,
            githubUsername: member.githubUsername,
            image: member.image,
            recentEvents: Array.isArray(events) ? events.length : 0,
          };
        } catch {
          return {
            name: member.name,
            githubUsername: member.githubUsername,
            image: member.image,
            recentEvents: 0,
          };
        }
      })
    );

    return NextResponse.json({
      taskStats,
      messages: {
        total: totalMessages,
        last7Days: recentMessages,
      },
      expenses: {
        total: totalExpense,
        count: expenses.length,
        trends: expenseTrendArray,
      },
      members: hub.members.length,
      memberActivity,
    });
  } catch (error) {
    console.error("ANALYTICS ERROR:", error);
    return NextResponse.json(
      { message: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}