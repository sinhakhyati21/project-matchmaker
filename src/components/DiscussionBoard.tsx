"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Discussion = {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  author?: {
    name?: string;
    githubUsername?: string;
    image?: string;
  };
  replies: {
    _id?: string;
    content: string;
    createdAt: string;
    author?: {
      name?: string;
      githubUsername?: string;
      image?: string;
    };
  }[];
};

export default function DiscussionBoard({
  hubId,
  projectId,
  discussions,
}: {
  hubId: string;
  projectId: string;
  discussions: Discussion[];
}) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [replyContent, setReplyContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  async function createDiscussion(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("Title and content are required");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/discussions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        hubId,
        projectId,
        title,
        content,
      }),
    });

    if (res.ok) {
      setTitle("");
      setContent("");
      router.refresh();
    } else {
      const data = await res.json();
      alert(data.message || "Failed to create discussion");
    }

    setLoading(false);
  }

  async function addReply(discussionId: string) {
    const content = replyContent[discussionId];

    if (!content?.trim()) {
      alert("Reply cannot be empty");
      return;
    }

    setLoading(true);

    const res = await fetch(`/api/discussions/${discussionId}/reply`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    });

    if (res.ok) {
      setReplyContent((prev) => ({
        ...prev,
        [discussionId]: "",
      }));
      router.refresh();
    } else {
      const data = await res.json();
      alert(data.message || "Failed to add reply");
    }

    setLoading(false);
  }

  return (
    <div className="border rounded-xl p-5 space-y-5">
      <h2 className="text-2xl font-bold">Discussion Board</h2>

      <form
        onSubmit={createDiscussion}
        className="border rounded-xl p-4 space-y-3"
      >
        <h3 className="font-bold">Start Discussion</h3>

        <input
          className="border rounded-lg px-3 py-2 w-full"
          placeholder="Discussion title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="border rounded-lg px-3 py-2 w-full"
          placeholder="Write your discussion..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          {loading ? "Posting..." : "Post Discussion"}
        </button>
      </form>

      {discussions.length === 0 ? (
        <p className="text-gray-500">No discussions yet.</p>
      ) : (
        <div className="space-y-4">
          {discussions.map((discussion) => (
            <div
              key={discussion._id}
              className="border rounded-xl p-4 space-y-4"
            >
              <div>
                <h3 className="font-bold text-lg">{discussion.title}</h3>

                <p className="text-gray-700 mt-2">{discussion.content}</p>

                <p className="text-xs text-gray-500 mt-2">
                  By {discussion.author?.name || "Unknown"} ·{" "}
                  {new Date(discussion.createdAt).toLocaleString("en-IN", {
                    dateStyle: "short",
                    timeStyle: "medium",
                  })}
                </p>
              </div>

              <div className="space-y-3 pl-4 border-l">
                <h4 className="font-semibold">Replies</h4>

                {discussion.replies.length === 0 ? (
                  <p className="text-sm text-gray-500">No replies yet.</p>
                ) : (
                  discussion.replies.map((reply, index) => (
                    <div
                      key={`${discussion._id}-reply-${index}`}
                      className="bg-gray-50 border rounded-lg p-3"
                    >
                      <p>{reply.content}</p>

                      <p className="text-xs text-gray-500 mt-2">
                        By {reply.author?.name || "Unknown"} ·{" "}
                        {new Date(reply.createdAt).toLocaleString("en-IN", {
                          dateStyle: "short",
                          timeStyle: "medium",
                        })}
                      </p>
                    </div>
                  ))
                )}

                <div className="flex gap-2">
                  <input
                    className="border rounded-lg px-3 py-2 w-full"
                    placeholder="Write a reply..."
                    value={replyContent[discussion._id] || ""}
                    onChange={(e) =>
                      setReplyContent((prev) => ({
                        ...prev,
                        [discussion._id]: e.target.value,
                      }))
                    }
                  />

                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => addReply(discussion._id)}
                    className="bg-black text-white px-4 py-2 rounded-lg disabled:opacity-50"
                  >
                    Reply
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}