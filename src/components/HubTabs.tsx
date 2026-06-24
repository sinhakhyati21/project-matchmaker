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

const TAB_STYLE =
  "px-4 py-2 text-sm font-medium rounded-lg transition-colors data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-gray-600 hover:text-black";

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
      <Tabs.List className="flex gap-2 flex-wrap border-b pb-3 mb-6">
        <Tabs.Trigger value="members" className={TAB_STYLE}>
          👥 Team
        </Tabs.Trigger>
        <Tabs.Trigger value="chat" className={TAB_STYLE}>
          💬 Chat
        </Tabs.Trigger>
        <Tabs.Trigger value="kanban" className={TAB_STYLE}>
          📋 Kanban
        </Tabs.Trigger>
        <Tabs.Trigger value="discussions" className={TAB_STYLE}>
          🗣 Discussions
        </Tabs.Trigger>
        <Tabs.Trigger value="resources" className={TAB_STYLE}>
          🔗 Resources
        </Tabs.Trigger>
        <Tabs.Trigger value="expenses" className={TAB_STYLE}>
          💸 Expenses
        </Tabs.Trigger>
        <Tabs.Trigger value="reviews" className={TAB_STYLE}>
          ⭐ Reviews
        </Tabs.Trigger>
      </Tabs.List>

      {/* Team Members */}
      <Tabs.Content value="members">
        <div className="grid md:grid-cols-2 gap-4">
          {hub.members.map((member: Member, i: number) => (
            <div
              key={`${member._id}-${i}`}
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
                <h3 className="font-bold">{member.name}</h3>
                <p className="text-sm text-gray-500">
                  @{member.githubUsername || "github"}
                </p>
                <p className="text-sm">
                  {member.status?.replaceAll("_", " ")}
                </p>
              </div>
            </div>
          ))}
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
      <Tabs.Content value="kanban" className="space-y-6">
        <CreateTaskForm hubId={hub._id} projectId={hub.project._id} />
        <KanbanBoard tasks={tasks} />
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
      <Tabs.Content value="reviews" className="space-y-6">
        <ReviewForm
          projectId={hub.project._id}
          projectStatus={hub.project.status}
          members={hub.members}
          currentUserId={currentUserId}
        />

        <div className="space-y-3">
          <h2 className="text-xl font-bold">Past Reviews</h2>
          {reviews.length === 0 ? (
            <p className="text-gray-500">No reviews yet.</p>
          ) : (
            reviews.map((review: any) => (
              <div key={review._id} className="border rounded-xl p-4">
                <p className="font-semibold">
                  {review.reviewer?.name} reviewed {review.reviewee?.name}
                </p>
                <p className="text-sm mt-2 text-gray-600">
                  Communication: {review.communication}/5 &nbsp;·&nbsp;
                  Technical: {review.technicalSkills}/5 &nbsp;·&nbsp;
                  Reliability: {review.reliability}/5 &nbsp;·&nbsp;
                  Teamwork: {review.teamwork}/5
                </p>
                {review.comment && (
                  <p className="text-gray-600 mt-2 italic">"{review.comment}"</p>
                )}
              </div>
            ))
          )}
        </div>
      </Tabs.Content>
    </Tabs.Root>
  );
}