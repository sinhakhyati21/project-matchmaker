"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const isDBError =
    error.message?.includes("MongoDB") ||
    error.message?.includes("ECONNREFUSED") ||
    error.message?.includes("MongooseServerSelectionError") ||
    error.message?.includes("Server selection timed out") ||
    error.digest?.includes("926634303");

  return (
    <div
      style={{
        maxWidth: 480,
        margin: "80px auto",
        padding: "0 24px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          padding: "40px 32px",
        }}
      >
        {isDBError ? (
          <>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
                fontSize: 22,
              }}
            >
              ⚡
            </div>
            <h2
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 8,
              }}
            >
              Connection Error
            </h2>
            <p
              style={{
                fontSize: 14,
                color: "var(--text-muted)",
                lineHeight: 1.6,
                marginBottom: 24,
              }}
            >
              Unable to connect to the database. This is usually temporary.
              Please try again in a few seconds.
            </p>
          </>
        ) : (
          <>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "rgba(245,158,11,0.1)",
                border: "1px solid rgba(245,158,11,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
                fontSize: 22,
              }}
            >
              ⚠️
            </div>
            <h2
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 8,
              }}
            >
              Something went wrong
            </h2>
            <p
              style={{
                fontSize: 14,
                color: "var(--text-muted)",
                lineHeight: 1.6,
                marginBottom: 24,
              }}
            >
              An unexpected error occurred. Please try again.
            </p>
          </>
        )}

        <button
          onClick={reset}
          style={{
            background: "#6366f1",
            color: "white",
            border: "none",
            padding: "10px 24px",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            width: "100%",
          }}
        >
          Try Again
        </button>

        <button
          onClick={() => window.location.href = "/"}
          style={{
            background: "transparent",
            color: "var(--text-muted)",
            border: "1px solid var(--border)",
            padding: "10px 24px",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            width: "100%",
            marginTop: 8,
          }}
        >
          Go Home
        </button>
      </div>
    </div>
  );
}