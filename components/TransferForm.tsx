"use client";

import { useState, useEffect } from "react";
import { Transfer, ACCOUNTS, AccountType, ACCOUNT_DESC } from "@/lib/types";

interface Props {
  onSave: (data: Omit<Transfer, "id" | "createdAt">) => void;
  onClose: () => void;
}

const inputClass = "w-full bg-[var(--c-input)] border border-[var(--c-input-border)] rounded-xl px-3 py-2.5 text-[var(--c-t1)] placeholder-[var(--c-t3)] focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-colors";

const PRESETS: { label: string; from: AccountType; to: AccountType; amount: number }[] = [
  { label: "TNG Visa top-up",  from: "Bank Savings", to: "TNG Visa",    amount: 600 },
  { label: "Wise top-up",      from: "Bank Savings", to: "Wise",         amount: 200 },
  { label: "Transit top-up",   from: "Bank Savings", to: "TNG Transit",  amount: 100 },
];

export default function TransferForm({ onSave, onClose }: Props) {
  const today = new Date().toISOString().slice(0, 10);
  const [fromAccount, setFromAccount] = useState<AccountType>("Bank Savings");
  const [toAccount, setToAccount]     = useState<AccountType>("TNG Visa");
  const [amount, setAmount]           = useState("");
  const [date, setDate]               = useState(today);
  const [note, setNote]               = useState("");
  const [error, setError]             = useState("");

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  function applyPreset(p: typeof PRESETS[number]) {
    setFromAccount(p.from); setToAccount(p.to); setAmount(p.amount.toString()); setError("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = parseFloat(amount);
    if (!amount || isNaN(parsed) || parsed <= 0) { setError("Please enter a valid amount."); return; }
    if (fromAccount === toAccount) { setError("From and To accounts must be different."); return; }
    onSave({ fromAccount, toAccount, amount: parsed, date, note });
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
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-8 h-8 rounded-xl bg-sky-500/10 flex items-center justify-center">
            <svg className="w-4 h-4 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold" style={{ color: "var(--c-t1)" }}>Transfer Between Accounts</h2>
        </div>

        {/* Quick presets */}
        <div className="flex gap-2 mb-5">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => applyPreset(p)}
              className="flex-1 text-xs py-2 px-2 rounded-xl transition-colors text-center font-medium"
              style={{ border: "1px solid var(--c-border)", color: "var(--c-t2)", backgroundColor: "var(--c-input)" }}
            >
              {p.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--c-t2)" }}>From</label>
              <select value={fromAccount} onChange={(e) => setFromAccount(e.target.value as AccountType)} className={inputClass}>
                {ACCOUNTS.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--c-t2)" }}>To</label>
              <select value={toAccount} onChange={(e) => setToAccount(e.target.value as AccountType)} className={inputClass}>
                {ACCOUNTS.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
          </div>
          {toAccount !== "Bank Savings" && toAccount !== fromAccount && (
            <p className="text-xs -mt-2 px-1" style={{ color: "var(--c-t3)" }}>{ACCOUNT_DESC[toAccount]}</p>
          )}

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

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--c-t2)" }}>Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--c-t2)" }}>
              Note <span style={{ color: "var(--c-t3)" }}>(optional)</span>
            </label>
            <input type="text" placeholder="e.g. Monthly top-up" value={note} onChange={(e) => setNote(e.target.value)} className={inputClass} />
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
              className="flex-1 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold transition-colors"
            >
              Transfer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
