import { redirect } from "next/navigation";
import { auth } from "../../auth";
import { connectDB } from "../../lib/db";
import Invitation from "../../models/Invitation.model";
import "../../models/Project.model";
import "../../models/User.model";
import InvitationActions from "../../components/InvitationActions";

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  PENDING: { bg: "rgba(245,158,11,0.15)", color: "#fbbf24" },
  ACCEPTED: { bg: "rgba(34,197,94,0.15)", color: "#4ade80" },
  DECLINED: { bg: "rgba(239,68,68,0.15)", color: "#f87171" },
};

export default async function InvitationsPage() {
  const session = await auth();
  if (!session || !require("mongoose").Types.ObjectId.isValid(session.user.id)) {
    redirect("/signin");
  }

  await connectDB();

  const invitations = await Invitation.find({
    receiver: session.user.id,
  })
    .populate("sender", "name githubUsername image")
    .populate("project", "title description")
    .sort({ createdAt: -1 });

  const safeInvitations = JSON.parse(JSON.stringify(invitations));

  const pendingCount = safeInvitations.filter(
    (i: any) => i.status === "PENDING"
  ).length;

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px" }}>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
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
              fontSize: 32,
              fontWeight: 800,
              color: "var(--text-primary)",
            }}
          >
            My Invitations
          </h1>
          {pendingCount > 0 && (
            <span
              style={{
                background: "rgba(245,158,11,0.15)",
                color: "#fbbf24",
                border: "1px solid rgba(245,158,11,0.3)",
                padding: "3px 10px",
                borderRadius: 9999,
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {pendingCount} pending
            </span>
          )}
        </div>
        <p style={{ color: "var(--text-muted)", fontSize: 15 }}>
          Team invitations sent to you by project owners.
        </p>
      </div>

      {/* Empty State */}
      {safeInvitations.length === 0 ? (
        <div
          style={{
            background: "var(--surface)",
            border: "1px dashed var(--border)",
            borderRadius: 16,
            padding: 64,
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "var(--text-primary)",
              marginBottom: 8,
            }}
          >
            No invitations yet
          </p>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
            When project owners invite you to join their team, it will appear
            here.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {safeInvitations.map((invitation: any) => {
            const statusStyle =
              STATUS_COLORS[invitation.status] || STATUS_COLORS.PENDING;

            return (
              <div
                key={invitation._id}
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 16,
                  padding: 24,
                }}
              >
                {/* Top Row */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 12,
                  }}
                >
                  <div>
                    <h2
                      style={{
                        fontSize: 18,
                        fontWeight: 700,
                        color: "var(--text-primary)",
                        marginBottom: 4,
                      }}
                    >
                      {invitation.project?.title}
                    </h2>
                    <p
                      style={{
                        fontSize: 13,
                        color: "var(--text-muted)",
                        lineHeight: 1.5,
                      }}
                    >
                      {invitation.project?.description}
                    </p>
                  </div>
                  <span
                    style={{
                      background: statusStyle.bg,
                      color: statusStyle.color,
                      padding: "4px 12px",
                      borderRadius: 9999,
                      fontSize: 12,
                      fontWeight: 600,
                      marginLeft: 16,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {invitation.status}
                  </span>
                </div>

                {/* Sender */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "12px 0",
                    borderTop: "1px solid var(--border)",
                    borderBottom:
                      invitation.status === "PENDING"
                        ? "1px solid var(--border)"
                        : "none",
                    marginBottom: invitation.status === "PENDING" ? 16 : 0,
                  }}
                >
                  {invitation.sender?.image && (
                    <img
                      src={invitation.sender.image}
                      alt={invitation.sender.name}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        border: "2px solid var(--border)",
                      }}
                    />
                  )}
                  <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
                    Invited by{" "}
                    <span
                      style={{
                        color: "var(--text-primary)",
                        fontWeight: 600,
                      }}
                    >
                      {invitation.sender?.name || "Unknown"}
                    </span>
                    {invitation.sender?.githubUsername && (
                      <span style={{ color: "var(--text-muted)" }}>
                        {" "}
                        (@{invitation.sender.githubUsername})
                      </span>
                    )}
                  </p>
                </div>

                {/* Actions */}
                {invitation.status === "PENDING" && (
                  <InvitationActions
                    invitationId={invitation._id}
                    status={invitation.status}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}