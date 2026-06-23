"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Message = {
  _id: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  sender?: {
    name?: string;
    githubUsername?: string;
    image?: string;
  };
};

export default function TeamChat({
  hubId,
  projectId,
  messages,
}: {
  hubId: string;
  projectId: string;
  messages: Message[];
}) {
  const router = useRouter();

  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();

    if (!content.trim()) {
      alert("Message cannot be empty");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        hubId,
        projectId,
        content,
        imageUrl,
      }),
    });

    if (res.ok) {
      setContent("");
      setImageUrl("");
      router.refresh();
    } else {
      const data = await res.json();
      alert(data.message || "Failed to send message");
    }

    setLoading(false);
  }

  return (
    <div className="border rounded-xl p-5 space-y-4">
      <h2 className="text-2xl font-bold">Team Chat</h2>

      <div className="space-y-3 max-h-96 overflow-y-auto border rounded-xl p-4 bg-gray-50">
        {messages.length === 0 ? (
          <p className="text-gray-500">No messages yet.</p>
        ) : (
          messages.map((message) => (
            <div
              key={message._id}
              className="bg-white border rounded-xl p-3"
            >
              <div className="flex items-center gap-3 mb-2">
                {message.sender?.image && (
                  <img
                    src={message.sender.image}
                    alt={message.sender?.name || "User"}
                    className="w-8 h-8 rounded-full"
                  />
                )}

                <div>
                  <p className="font-semibold">
                    {message.sender?.name || "Unknown User"}
                  </p>

                  <p className="text-xs text-gray-500">
                    @{message.sender?.githubUsername || "github"}
                  </p>
                </div>
              </div>

              <p>{message.content}</p>

              {message.imageUrl && (
                <img
                  src={message.imageUrl}
                  alt="Shared image"
                  className="mt-3 rounded-lg max-h-60 border"
                />
              )}

              <p className="text-xs text-gray-400 mt-2">
                {new Date(message.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>

      <form onSubmit={sendMessage} className="space-y-3">
        <textarea
          className="border rounded-lg px-3 py-2 w-full"
          placeholder="Type a message..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <input
          className="border rounded-lg px-3 py-2 w-full"
          placeholder="Optional image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />

        <button
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
}