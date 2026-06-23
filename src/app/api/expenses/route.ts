import { NextResponse } from "next/server";
import { auth } from "../../../auth";
import { connectDB } from "../../../lib/db";
import Expense from "../../../models/Expense.model";
import Hub from "../../../models/Hub.model";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { hubId, projectId, title, amount, note } = await req.json();

    if (!title || amount === undefined || Number(amount) <= 0) {
      return NextResponse.json(
        { message: "Valid title and amount are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const hub = await Hub.findById(hubId);
    if (!hub) {
      return NextResponse.json({ message: "Hub not found" }, { status: 404 });
    }

    const isMember = hub.members.some(
      (memberId: any) => memberId.toString() === session.user.id
    );
    if (!isMember) {
      return NextResponse.json({ message: "Not allowed" }, { status: 403 });
    }

    const expense = await Expense.create({
      hub: hubId,
      project: projectId,
      title,
      amount: Number(amount),
      note,
      paidBy: session.user.id,
    });

    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    console.error("EXPENSE CREATE ERROR:", error);
    return NextResponse.json({ message: "Failed to create expense" }, { status: 500 });
  }
}