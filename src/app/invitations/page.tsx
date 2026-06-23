import { redirect } from "next/navigation";

import { auth } from "../../auth";
import { connectDB } from "../../lib/db";

import Invitation from "../../models/Invitation.model";
import "../../models/Project.model";
import "../../models/User.model";

export default async function InvitationsPage() {
  const session = await auth();

  if (!session) {
    redirect("/signin");
  }

  await connectDB();

  const invitations = await Invitation.find({
    receiver:
      process.env.NODE_ENV === "development"
        ? { $exists: true }
        : session.user.id,
  })
    .populate("sender", "name githubUsername image")
    .populate("project", "title description")
    .sort({ createdAt: -1 });

  const safeInvitations = JSON.parse(
    JSON.stringify(invitations)
  );

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">
        My Invitations
      </h1>

      {safeInvitations.length === 0 ? (
        <p className="text-gray-500">
          No invitations found.
        </p>
      ) : (
        <div className="space-y-4">
          {safeInvitations.map((invitation: any) => (
            <div
              key={invitation._id}
              className="border rounded-xl p-5"
            >
              <h2 className="font-bold text-lg">
                {invitation.project?.title}
              </h2>

              <p className="text-gray-600">
                {invitation.project?.description}
              </p>

              <p className="mt-2">
                Invited by:{" "}
                {invitation.sender?.name || "Unknown"}
              </p>

              <p className="mt-2">
                Status: <b>{invitation.status}</b>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}