"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

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
  messages: initialMessages,
  currentUserId,
}: {
  hubId: string;
  projectId: string;
  messages: Message[];
  currentUserId: string;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [chatMessages, setChatMessages] = useState<Message[]>(initialMessages);
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const es = new EventSource(`/api/messages/stream?hubId=${hubId}`);
    es.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.type === "init") {
        setChatMessages(data.messages);
      } else if (data.type === "message") {
        setChatMessages((prev) => {
          const exists = prev.some((m) => m._id === data.message._id);
          if (exists) return prev;
          return [...prev, data.message];
        });
      } else if (data.type === "typing") {
        // Ignore own typing events
        if (data.userId === currentUserId) return;
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 3000);
      }
    };
    es.onerror = () => es.close();
    return () => es.close();
  }, [hubId, currentUserId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  function handleTyping() {
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    fetch(`/api/messages/typing`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hubId }),
    });
    typingTimeout.current = setTimeout(() => {}, 2000);
  }

  function handleDeviceImage(file: File) {
    const reader = new FileReader();
    reader.onloadend = () => setImageUrl(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() && !imageUrl) {
      toast.error("Message or image is required");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
    } else {
      const data = await res.json();
      toast.error(data.message || "Failed to send message");
    }
    setLoading(false);
  }

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

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div
        style={{
          background: "var(--background)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          padding: 16,
          maxHeight: 420,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {chatMessages.length === 0 ? (
          <p style={{ color: "var(--text-muted)", fontSize: 14, textAlign: "center", padding: "20px 0" }}>
            No messages yet. Say hello!
          </p>
        ) : (
          chatMessages.map((message) => (
            <div
              key={message._id}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 10,
                padding: "12px 14px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                {message.sender?.image && (
                  <img
                    src={message.sender.image}
                    alt={message.sender?.name || "User"}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      border: "1px solid var(--border)",
                      flexShrink: 0,
                    }}
                  />
                )}
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>
                    {message.sender?.name || "Unknown"}
                  </p>
                  <p style={{ fontSize: 11, color: "var(--text-muted)" }}>
                    @{message.sender?.githubUsername || "github"}
                  </p>
                </div>
              </div>
              <p style={{ fontSize: 14, color: "var(--text-primary)", lineHeight: 1.5 }}>
                {message.content}
              </p>
              {message.imageUrl && (
                <img
                  src={message.imageUrl}
                  alt="Shared"
                  style={{
                    marginTop: 10,
                    borderRadius: 8,
                    maxHeight: 280,
                    border: "1px solid var(--border)",
                    objectFit: "contain",
                  }}
                />
              )}
              <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 8 }}>
                {new Date(message.createdAt).toLocaleString("en-IN", {
                  dateStyle: "short",
                  timeStyle: "medium",
                })}
              </p>
            </div>
          ))
        )}

        {isTyping && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 4px" }}>
            <span style={{ display: "flex", gap: 3 }}>
              {[0, 150, 300].map((delay) => (
                <span
                  key={delay}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "var(--text-muted)",
                    display: "inline-block",
                    animation: "bounce 1s infinite",
                    animationDelay: `${delay}ms`,
                  }}
                />
              ))}
            </span>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
              Someone is typing...
            </span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={sendMessage} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <textarea
          style={{ ...inputStyle, minHeight: 72, resize: "vertical" as const }}
          placeholder="Type a message..."
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            handleTyping();
          }}
        />

        {imageUrl && (
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: 12 }}>
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>Image preview</p>
            <img
              src={imageUrl}
              alt="Preview"
              style={{ maxHeight: 180, borderRadius: 8, border: "1px solid var(--border)", objectFit: "contain" }}
            />
            <button
              type="button"
              onClick={() => setImageUrl("")}
              style={{ background: "none", border: "none", color: "#f87171", fontSize: 13, cursor: "pointer", marginTop: 8, padding: 0 }}
            >
              Remove image
            </button>
          </div>
        )}

        {showImageOptions && (
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: 12, display: "flex", flexDirection: "column" as const, gap: 8 }}>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{ background: "var(--background)", border: "1px solid var(--border)", color: "var(--text-primary)", padding: "8px 14px", borderRadius: 8, fontSize: 13, cursor: "pointer", textAlign: "left" as const }}
            >
              Upload image from device
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleDeviceImage(file);
              }}
            />
            <input
              style={inputStyle}
              placeholder="Or paste image URL..."
              value={imageUrl.startsWith("data:") ? "" : imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>
        )}

        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="button"
            onClick={() => setShowImageOptions((p) => !p)}
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              color: "var(--text-muted)",
              width: 40,
              height: 40,
              borderRadius: 8,
              fontSize: 18,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            +
          </button>
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
              flex: 1,
            }}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
}