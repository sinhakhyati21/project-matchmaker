"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

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

  const inputStyle = {
    width: "100%",
    background: "var(--background)",
    border: "1px solid var(--border)",
    color: "var(--text-primary)",
    borderRadius: 8,
    padding: "10px 14px",
    fontSize: 14,
    outline: "none",
  };

  async function createDiscussion(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("Title and content are required");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/discussions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hubId, projectId, title, content }),
    });
    if (res.ok) {
      toast.success("Discussion posted!");
      setTitle("");
      setContent("");
      router.refresh();
    } else {
      const data = await res.json();
      toast.error(data.message || "Failed to create discussion");
    }
    setLoading(false);
  }

  async function addReply(discussionId: string) {
    const reply = replyContent[discussionId];
    if (!reply?.trim()) {
      toast.error("Reply cannot be empty");
      return;
    }
    setLoading(true);
    const res = await fetch(`/api/discussions/${discussionId}/reply`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: reply }),
    });
    if (res.ok) {
      toast.success("Reply added!");
      setReplyContent((prev) => ({ ...prev, [discussionId]: "" }));
      router.refresh();
    } else {
      const data = await res.json();
      toast.error(data.message || "Failed to add reply");
    }
    setLoading(false);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* New Discussion Form */}
      <form
        onSubmit={createDiscussion}
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          padding: "20px 24px",
          display: "flex",
          flexDirection: "column" as const,
          gap: 12,
        }}
      >
        <h3
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: "var(--text-primary)",
            marginBottom: 4,
          }}
        >
          Start a Discussion
        </h3>
        <input
          style={inputStyle}
          placeholder="Discussion title (e.g. Planning the Database)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          style={{ ...inputStyle, minHeight: 80, resize: "vertical" as const }}
          placeholder="Write your discussion..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          disabled={loading}
          style={{
            background: loading ? "var(--border)" : "#6366f1",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            alignSelf: "flex-start" as const,
          }}
        >
          {loading ? "Posting..." : "Post Discussion"}
        </button>
      </form>

      {/* Discussion List */}
      {discussions.length === 0 ? (
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
            No discussions yet. Start one above.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {discussions.map((discussion) => (
            <div
              key={discussion._id}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: "20px 24px",
                display: "flex",
                flexDirection: "column" as const,
                gap: 16,
              }}
            >
              {/* Discussion Header */}
              <div>
                <h3
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    marginBottom: 6,
                  }}
                >
                  {discussion.title}
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    color: "var(--text-muted)",
                    lineHeight: 1.6,
                    marginBottom: 8,
                  }}
                >
                  {discussion.content}
                </p>
                <p style={{ fontSize: 11, color: "var(--text-muted)" }}>
                  By {discussion.author?.name || "Unknown"} ·{" "}
                  {new Date(discussion.createdAt).toLocaleString("en-IN", {
                    dateStyle: "short",
                    timeStyle: "medium",
                  })}
                </p>
              </div>

              {/* Replies */}
              <div
                style={{
                  borderTop: "1px solid var(--border)",
                  paddingTop: 16,
                  display: "flex",
                  flexDirection: "column" as const,
                  gap: 10,
                }}
              >
                <h4
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "var(--text-muted)",
                    textTransform: "uppercase" as const,
                    letterSpacing: "0.05em",
                  }}
                >
                  Replies ({discussion.replies.length})
                </h4>

                {discussion.replies.map((reply, index) => (
                  <div
                    key={`${discussion._id}-reply-${index}`}
                    style={{
                      background: "var(--background)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      padding: "10px 14px",
                    }}
                  >
                    <p
                      style={{
                        fontSize: 13,
                        color: "var(--text-primary)",
                        lineHeight: 1.5,
                        marginBottom: 6,
                      }}
                    >
                      {reply.content}
                    </p>
                    <p style={{ fontSize: 11, color: "var(--text-muted)" }}>
                      By {reply.author?.name || "Unknown"} ·{" "}
                      {new Date(reply.createdAt).toLocaleString("en-IN", {
                        dateStyle: "short",
                        timeStyle: "medium",
                      })}
                    </p>
                  </div>
                ))}

                {/* Reply Input */}
                <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                  <input
                    style={inputStyle}
                    placeholder="Write a reply..."
                    value={replyContent[discussion._id] || ""}
                    onChange={(e) =>
                      setReplyContent((prev) => ({
                        ...prev,
                        [discussion._id]: e.target.value,
                      }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addReply(discussion._id);
                      }
                    }}
                  />
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => addReply(discussion._id)}
                    style={{
                      background: "#6366f1",
                      color: "white",
                      border: "none",
                      padding: "10px 16px",
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: loading ? "not-allowed" : "pointer",
                      whiteSpace: "nowrap" as const,
                      opacity: loading ? 0.6 : 1,
                    }}
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