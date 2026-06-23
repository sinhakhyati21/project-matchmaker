"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

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

  async function addExpense(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim() || Number(amount) <= 0) {
      alert("Enter valid title and amount");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/expenses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        hubId,
        projectId,
        title,
        amount,
        note,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setTitle("");
      setAmount("");
      setNote("");
      router.refresh();
    } else {
      alert(data.message || "Failed to add expense");
    }

    setLoading(false);
  }

  return (
    <div className="border rounded-xl p-5 space-y-5">
      <div>
        <h2 className="text-2xl font-bold">Expense Tracker</h2>
        <p className="text-gray-500 text-sm mt-1">
          Track shared project spending.
        </p>
      </div>

      <div className="border rounded-xl p-4 bg-gray-50">
        <p className="text-sm text-gray-500">Total Expense</p>
        <p className="text-3xl font-bold">
          ₹{totalExpense.toFixed(2)}
        </p>
      </div>

      <form
        onSubmit={addExpense}
        className="border rounded-xl p-4 space-y-3"
      >
        <h3 className="font-bold">Add Expense</h3>

        <input
          className="border rounded-lg px-3 py-2 w-full"
          placeholder="Expense title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="number"
          min="1"
          className="border rounded-lg px-3 py-2 w-full"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <textarea
          className="border rounded-lg px-3 py-2 w-full"
          placeholder="Optional note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <button
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Expense"}
        </button>
      </form>

      <div className="space-y-3">
        <h3 className="font-bold">Expense History</h3>

        {expenses.length === 0 ? (
          <p className="text-gray-500">No expenses added yet.</p>
        ) : (
          expenses.map((expense) => (
            <div
              key={expense._id}
              className="border rounded-xl p-4 flex justify-between gap-4"
            >
              <div>
                <h4 className="font-bold">{expense.title}</h4>

                <p className="text-sm text-gray-500">
                  Paid by{" "}
                  {expense.paidBy?.name ||
                    expense.paidBy?.githubUsername ||
                    "Unknown"}
                </p>

                {expense.note && (
                  <p className="text-sm mt-2">{expense.note}</p>
                )}
              </div>

              <div className="text-right">
                <p className="font-bold">₹{expense.amount}</p>

                <p className="text-xs text-gray-500">
                  {new Date(expense.createdAt).toLocaleString("en-IN", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}