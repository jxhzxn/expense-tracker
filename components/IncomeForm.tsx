"use client";

import { useState, useEffect } from "react";
import { Income, ACCOUNTS, AccountType } from "@/lib/types";

interface Props {
  income?: Income | null;
  onSave: (data: Omit<Income, "id" | "createdAt">) => void;
  onClose: () => void;
}

const inputClass = "w-full bg-[var(--c-input)] border border-[var(--c-border)] rounded-lg px-3 py-2.5 text-[var(--c-t1)] placeholder-[var(--c-t3)] focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500";

export default function IncomeForm({ income, onSave, onClose }: Props) {
  const today = new Date().toISOString().slice(0, 10);
  const [amount, setAmount] = useState(income?.amount.toString() ?? "");
  const [source, setSource] = useState(income?.source ?? "Monthly Salary");
  const [date, setDate] = useState(income?.date ?? today);
  const [note, setNote] = useState(income?.note ?? "");
  const [account, setAccount] = useState<AccountType>(income?.account ?? "Bank Savings");
  const [error, setError] = useState("");

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = parseFloat(amount);
    if (!amount || isNaN(parsed) || parsed <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    if (!source.trim()) {
      setError("Please enter an income source.");
      return;
    }
    onSave({ amount: parsed, source: source.trim(), date, note, account });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md rounded-2xl p-6 shadow-2xl border" style={{ backgroundColor: "var(--c-card)", borderColor: "var(--c-border)" }}>
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-[var(--c-t1)]">
            {income ? "Edit Income" : "Add Income"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-[var(--c-t2)] mb-1">Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--c-t2)] text-sm font-medium">RM</span>
              <input
                type="number" inputMode="decimal" min="0.01" step="0.01" placeholder="0.00"
                value={amount}
                onChange={(e) => { setAmount(e.target.value); setError(""); }}
                className={`${inputClass} pl-10`}
                style={{ borderColor: "var(--c-border)" }}
                autoFocus
              />
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <div>
            <label className="block text-sm text-[var(--c-t2)] mb-1">Source</label>
            <input
              type="text" placeholder="e.g. Monthly Salary, Bonus"
              value={source}
              onChange={(e) => { setSource(e.target.value); setError(""); }}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm text-[var(--c-t2)] mb-1">Into Account</label>
            <select value={account} onChange={(e) => setAccount(e.target.value as AccountType)} className={inputClass}>
              {ACCOUNTS.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm text-[var(--c-t2)] mb-1">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
          </div>

          <div>
            <label className="block text-sm text-[var(--c-t2)] mb-1">
              Note <span className="text-[var(--c-t3)]">(optional)</span>
            </label>
            <input
              type="text" placeholder="Any notes..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border text-[var(--c-t4)] hover:bg-[var(--c-hover)] transition-colors"
              style={{ borderColor: "var(--c-border)" }}>
              Cancel
            </button>
            <button type="submit"
              className="flex-1 py-2.5 rounded-lg bg-green-600 hover:bg-green-500 text-white font-medium transition-colors">
              {income ? "Save Changes" : "Add Income"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
