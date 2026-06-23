"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

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
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleDeviceImage(file: File) {
    const reader = new FileReader();

    reader.onloadend = () => {
      setImageUrl(reader.result as string);
    };

    reader.readAsDataURL(file);
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();

    if (!content.trim() && !imageUrl) {
      alert("Message or image is required");
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
        content: content || "Shared an image",
        imageUrl,
      }),
    });

    if (res.ok) {
      setContent("");
      setImageUrl("");
      setShowImageOptions(false);
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
            <div key={message._id} className="bg-white border rounded-xl p-3">
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
                  className="mt-3 rounded-lg max-h-72 border object-contain"
                />
              )}

              <p className="text-xs text-gray-400 mt-2">
                { 
                    new Date(message.createdAt).toLocaleString("en-IN", {
                    dateStyle: "short",
                    timeStyle: "medium",
                })}
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

        {imageUrl && (
          <div className="border rounded-xl p-3">
            <p className="text-sm text-gray-500 mb-2">Image preview</p>

            <img
              src={imageUrl}
              alt="Preview"
              className="max-h-48 rounded-lg border object-contain"
            />

            <button
              type="button"
              onClick={() => setImageUrl("")}
              className="text-red-600 text-sm mt-2"
            >
              Remove image
            </button>
          </div>
        )}

        {showImageOptions && (
          <div className="border rounded-xl p-3 space-y-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="border px-3 py-2 rounded-lg w-full text-left"
            >
              Upload image from device
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (file) {
                  handleDeviceImage(file);
                }
              }}
            />

            <input
              className="border rounded-lg px-3 py-2 w-full"
              placeholder="Paste image URL from web"
              value={imageUrl.startsWith("data:") ? "" : imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>
        )}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowImageOptions((prev) => !prev)}
            className="border px-4 py-2 rounded-lg"
          >
            +
          </button>

          <button
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </div>
      </form>
    </div>
  );
}