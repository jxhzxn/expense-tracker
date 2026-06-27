"use client";

import { useState, useEffect } from "react";
import { Expense, CATEGORIES, Category, ACCOUNTS, AccountType } from "@/lib/types";

interface Props {
  expense?: Expense | null;
  onSave: (data: Omit<Expense, "id" | "createdAt">) => void;
  onClose: () => void;
}

const inputClass = "w-full bg-[var(--c-input)] border border-[var(--c-input-border)] rounded-xl px-3 py-2.5 text-[var(--c-t1)] placeholder-[var(--c-t3)] focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-colors";

export default function ExpenseForm({ expense, onSave, onClose }: Props) {
  const today = new Date().toISOString().slice(0, 10);
  const [amount, setAmount]     = useState(expense?.amount.toString() ?? "");
  const [category, setCategory] = useState<Category>(expense?.category ?? "Food & Drink");
  const [account, setAccount]   = useState<AccountType>(expense?.account ?? "TNG Visa");
  const [date, setDate]         = useState(expense?.date ?? today);
  const [note, setNote]         = useState(expense?.note ?? "");
  const [error, setError]       = useState("");

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = parseFloat(amount);
    if (!amount || isNaN(parsed) || parsed <= 0) { setError("Please enter a valid amount."); return; }
    onSave({ amount: parsed, category, account, date, note });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-md rounded-2xl p-6"
        style={{ backgroundColor: "var(--c-card)", boxShadow: "var(--c-shadow-lg)" }}
      >
        <h2 className="text-lg font-semibold mb-5" style={{ color: "var(--c-t1)" }}>
          {expense ? "Edit Expense" : "Add Expense"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--c-t2)" }}>Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold" style={{ color: "var(--c-t3)" }}>RM</span>
              <input
                type="number" inputMode="decimal" min="0.01" step="0.01" placeholder="0.00"
                value={amount}
                onChange={(e) => { setAmount(e.target.value); setError(""); }}
                className={`${inputClass} pl-10`}
                autoFocus
              />
            </div>
            {error && <p className="text-red-500 text-sm mt-1.5">{error}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--c-t2)" }}>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value as Category)} className={inputClass}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--c-t2)" }}>Paid with</label>
              <select value={account} onChange={(e) => setAccount(e.target.value as AccountType)} className={inputClass}>
                {ACCOUNTS.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--c-t2)" }}>Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--c-t2)" }}>
              Note <span style={{ color: "var(--c-t3)" }}>(optional)</span>
            </label>
            <input type="text" placeholder="What was this for?" value={note} onChange={(e) => setNote(e.target.value)} className={inputClass} />
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-[var(--c-hover)]"
              style={{ border: "1px solid var(--c-border)", color: "var(--c-t2)" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors"
            >
              {expense ? "Save Changes" : "Add Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
