import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { connectDB } from "../../../../lib/db";
import Hub from "../../../../models/Hub.model";
import Task from "../../../../models/Task.model";
import Message from "../../../../models/Message.model";
import Expense from "../../../../models/Expense.model";

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

    // Messages analytics — last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentMessages = await Message.countDocuments({
      hub: hub._id,
      createdAt: { $gte: sevenDaysAgo },
    });

    const totalMessages = await Message.countDocuments({ hub: hub._id });

    // Expense analytics
    const expenses = await Expense.find({ hub: hub._id });
    const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

    return NextResponse.json({
      taskStats,
      messages: {
        total: totalMessages,
        last7Days: recentMessages,
      },
      expenses: {
        total: totalExpense,
        count: expenses.length,
      },
      members: hub.members.length,
    });
  } catch (error) {
    console.error("ANALYTICS ERROR:", error);
    return NextResponse.json(
      { message: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}