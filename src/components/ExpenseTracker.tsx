"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type Expense = {
  _id: string;
  title: string;
  amount: number;
  note?: string;
  createdAt: string;
  paidBy?: {
    name?: string;
    githubUsername?: string;
  };
};

export default function ExpenseTracker({
  hubId,
  projectId,
  expenses,
}: {
  hubId: string;
  projectId: string;
  expenses: Expense[];
}) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const totalExpense = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const largestExpense = expenses.reduce(
    (max, expense) => (expense.amount > max ? expense.amount : max),
    0
  );

  async function addExpense(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim() || Number(amount) <= 0) {
      toast.error("Enter valid title and amount");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hubId, projectId, title, amount, note }),
    });

    const data = await res.json();
    if (res.ok) {
      toast.success("Expense added!");
      setTitle("");
      setAmount("");
      setNote("");
      router.refresh();
    } else {
      toast.error(data.message || "Failed to add expense");
    }
    setLoading(false);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Stats Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: 12,
        }}
      >
        <div
          style={{
            background: "rgba(99,102,241,0.1)",
            border: "1px solid rgba(99,102,241,0.2)",
            borderRadius: 12,
            padding: 16,
          }}
        >
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>
            Total Spent
          </p>
          <p style={{ fontSize: 24, fontWeight: 800, color: "#818cf8" }}>
            ₹{totalExpense.toFixed(2)}
          </p>
        </div>
        <div
          style={{
            background: "rgba(34,197,94,0.1)",
            border: "1px solid rgba(34,197,94,0.2)",
            borderRadius: 12,
            padding: 16,
          }}
        >
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>
            Total Entries
          </p>
          <p style={{ fontSize: 24, fontWeight: 800, color: "#4ade80" }}>
            {expenses.length}
          </p>
        </div>
        <div
          style={{
            background: "rgba(245,158,11,0.1)",
            border: "1px solid rgba(245,158,11,0.2)",
            borderRadius: 12,
            padding: 16,
          }}
        >
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>
            Largest Expense
          </p>
          <p style={{ fontSize: 24, fontWeight: 800, color: "#fbbf24" }}>
            ₹{largestExpense.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Add Expense Form */}
      <form
        onSubmit={addExpense}
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          padding: 20,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <h3 style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: 15 }}>
          Add Expense
        </h3>
        <input
          style={{
            background: "var(--background)",
            border: "1px solid var(--border)",
            color: "var(--text-primary)",
            borderRadius: 8,
            padding: "9px 14px",
            fontSize: 14,
            outline: "none",
            width: "100%",
          }}
          placeholder="Expense title (e.g. AWS bill)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="number"
          min="1"
          style={{
            background: "var(--background)",
            border: "1px solid var(--border)",
            color: "var(--text-primary)",
            borderRadius: 8,
            padding: "9px 14px",
            fontSize: 14,
            outline: "none",
            width: "100%",
          }}
          placeholder="Amount (₹)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <textarea
          style={{
            background: "var(--background)",
            border: "1px solid var(--border)",
            color: "var(--text-primary)",
            borderRadius: 8,
            padding: "9px 14px",
            fontSize: 14,
            outline: "none",
            width: "100%",
            resize: "vertical",
          }}
          placeholder="Optional note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
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
            alignSelf: "flex-start",
          }}
        >
          {loading ? "Adding..." : "Add Expense"}
        </button>
      </form>

      {/* Expense History */}
      <div>
        <h3
          style={{
            fontWeight: 700,
            color: "var(--text-primary)",
            fontSize: 15,
            marginBottom: 12,
          }}
        >
          Expense History
        </h3>
        {expenses.length === 0 ? (
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
              No expenses added yet.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {expenses.map((expense) => {
              const pct =
                totalExpense > 0
                  ? Math.round((expense.amount / totalExpense) * 100)
                  : 0;

              return (
                <div
                  key={expense._id}
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    padding: 16,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: 8,
                    }}
                  >
                    <div>
                      <h4
                        style={{
                          fontWeight: 700,
                          color: "var(--text-primary)",
                          fontSize: 14,
                          marginBottom: 2,
                        }}
                      >
                        {expense.title}
                      </h4>
                      <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                        Paid by{" "}
                        {expense.paidBy?.name ||
                          expense.paidBy?.githubUsername ||
                          "Unknown"}{" "}
                        ·{" "}
                        {new Date(expense.createdAt).toLocaleString("en-IN", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </p>
                      {expense.note && (
                        <p
                          style={{
                            fontSize: 12,
                            color: "var(--text-muted)",
                            marginTop: 4,
                            fontStyle: "italic",
                          }}
                        >
                          {expense.note}
                        </p>
                      )}
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p
                        style={{
                          fontWeight: 700,
                          fontSize: 16,
                          color: "#818cf8",
                        }}
                      >
                        ₹{expense.amount}
                      </p>
                      <p style={{ fontSize: 11, color: "var(--text-muted)" }}>
                        {pct}% of total
                      </p>
                    </div>
                  </div>

                  {/* Progress bar showing % of total */}
                  <div
                    style={{
                      height: 3,
                      background: "var(--border)",
                      borderRadius: 9999,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${pct}%`,
                        background: "#6366f1",
                        borderRadius: 9999,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}