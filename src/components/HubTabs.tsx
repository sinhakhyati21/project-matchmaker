"use client";

import * as Tabs from "@radix-ui/react-tabs";
import KanbanBoard from "./KanbanBoard";
import TeamChat from "./TeamChat";
import DiscussionBoard from "./DiscussionBoard";
import ResourceVault from "./ResourceVault";
import ExpenseTracker from "./ExpenseTracker";
import ReviewForm from "./ReviewForm";
import CreateTaskForm from "./CreateTaskForm";

type Member = {
  _id: string;
  name?: string;
  githubUsername?: string;
  image?: string;
  status?: string;
};

type HubTabsProps = {
  hub: any;
  tasks: any[];
  resources: any[];
  messages: any[];
  reviews: any[];
  discussions: any[];
  expenses: any[];
  currentUserId: string;
};

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  AVAILABLE: { bg: "rgba(34,197,94,0.15)", color: "#4ade80" },
  BUSY: { bg: "rgba(239,68,68,0.15)", color: "#f87171" },
  LOOKING_FOR_TEAM: { bg: "rgba(99,102,241,0.15)", color: "#818cf8" },
  LOOKING_FOR_PROJECT: { bg: "rgba(34,211,238,0.15)", color: "#22d3ee" },
};

export default function HubTabs({
  hub,
  tasks,
  resources,
  messages,
  reviews,
  discussions,
  expenses,
  currentUserId,
}: HubTabsProps) {
  return (
    <Tabs.Root defaultValue="members">

      {/* Tab List */}
      <Tabs.List
        style={{
          display: "flex",
          gap: 6,
          flexWrap: "wrap",
          borderBottom: "1px solid var(--border)",
          paddingBottom: 12,
          marginBottom: 24,
        }}
      >
        {[
          { value: "members", label: "👥 Team" },
          { value: "chat", label: "💬 Chat" },
          { value: "kanban", label: "📋 Kanban" },
          { value: "discussions", label: "🗣 Discussions" },
          { value: "resources", label: "🔗 Resources" },
          { value: "expenses", label: "💸 Expenses" },
          { value: "reviews", label: "⭐ Reviews" },
        ].map((tab) => (
          <Tabs.Trigger
            key={tab.value}
            value={tab.value}
            style={{
              padding: "7px 14px",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              border: "1px solid transparent",
              transition: "all 0.2s",
              background: "transparent",
              color: "var(--text-muted)",
            }}
            className="hub-tab"
          >
            {tab.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      <style>{`
        .hub-tab:hover {
          color: var(--text-primary) !important;
          background: var(--surface) !important;
          border-color: var(--border) !important;
        }
        .hub-tab[data-state="active"] {
          background: #6366f1 !important;
          color: white !important;
          border-color: #6366f1 !important;
        }
      `}</style>

      {/* Team Members */}
      <Tabs.Content value="members">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 16,
          }}
        >
          {hub.members.map((member: Member, i: number) => {
            const statusStyle =
              STATUS_COLORS[member.status || ""] || null;
            return (
              <div
                key={`${member._id}-${i}`}
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  padding: 16,
                  display: "flex",
                  gap: 14,
                  alignItems: "center",
                }}
              >
                {member.image && (
                  <img
                    src={member.image}
                    alt={member.name}
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      border: "2px solid var(--border)",
                    }}
                  />
                )}
                <div>
                  <h3
                    style={{
                      fontWeight: 700,
                      fontSize: 15,
                      color: "var(--text-primary)",
                      marginBottom: 2,
                    }}
                  >
                    {member.name}
                  </h3>
                  <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>
                    @{member.githubUsername || "github"}
                  </p>
                  {member.status && (
                    <span
                      style={{
                        background: statusStyle?.bg || "rgba(161,161,170,0.15)",
                        color: statusStyle?.color || "#a1a1aa",
                        padding: "2px 8px",
                        borderRadius: 9999,
                        fontSize: 11,
                        fontWeight: 500,
                      }}
                    >
                      {member.status.replaceAll("_", " ")}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Tabs.Content>

      {/* Chat */}
      <Tabs.Content value="chat">
        <TeamChat
          hubId={hub._id}
          projectId={hub.project._id}
          messages={messages}
        />
      </Tabs.Content>

      {/* Kanban */}
      <Tabs.Content value="kanban">
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <CreateTaskForm hubId={hub._id} projectId={hub.project._id} />
          <KanbanBoard tasks={tasks} />
        </div>
      </Tabs.Content>

      {/* Discussions */}
      <Tabs.Content value="discussions">
        <DiscussionBoard
          hubId={hub._id}
          projectId={hub.project._id}
          discussions={discussions}
        />
      </Tabs.Content>

      {/* Resources */}
      <Tabs.Content value="resources">
        <ResourceVault
          hubId={hub._id}
          projectId={hub.project._id}
          resources={resources}
        />
      </Tabs.Content>

      {/* Expenses */}
      <Tabs.Content value="expenses">
        <ExpenseTracker
          hubId={hub._id}
          projectId={hub.project._id}
          expenses={expenses}
        />
      </Tabs.Content>

      {/* Reviews */}
      <Tabs.Content value="reviews">
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <ReviewForm
            projectId={hub.project._id}
            projectStatus={hub.project.status}
            members={hub.members}
            currentUserId={currentUserId}
          />

          <div>
            <h2
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 16,
              }}
            >
              Past Reviews
            </h2>
            {reviews.length === 0 ? (
              <div
                style={{
                  background: "var(--surface)",
                  border: "1px dashed var(--border)",
                  borderRadius: 12,
                  padding: 32,
                  textAlign: "center",
                }}
              >
                <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
                  No reviews yet. Mark project as Completed to unlock reviews.
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {reviews.map((review: any) => (
                  <div
                    key={review._id}
                    style={{
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                      borderRadius: 12,
                      padding: 16,
                    }}
                  >
                    <p
                      style={{
                        fontWeight: 600,
                        fontSize: 14,
                        color: "var(--text-primary)",
                        marginBottom: 8,
                      }}
                    >
                      {review.reviewer?.name} reviewed {review.reviewee?.name}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 8,
                        marginBottom: 8,
                      }}
                    >
                      {[
                        { label: "Communication", value: review.communication },
                        { label: "Technical", value: review.technicalSkills },
                        { label: "Reliability", value: review.reliability },
                        { label: "Teamwork", value: review.teamwork },
                      ].map((r) => (
                        <span
                          key={r.label}
                          style={{
                            background: "rgba(99,102,241,0.1)",
                            color: "#818cf8",
                            border: "1px solid rgba(99,102,241,0.2)",
                            padding: "3px 10px",
                            borderRadius: 9999,
                            fontSize: 12,
                          }}
                        >
                          {r.label}: {r.value}/5
                        </span>
                      ))}
                    </div>
                    {review.comment && (
                      <p
                        style={{
                          fontSize: 13,
                          color: "var(--text-muted)",
                          fontStyle: "italic",
                        }}
                      >
                        "{review.comment}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Tabs.Content>
    </Tabs.Root>
  );
}