"use client";

import { useState } from "react";
import { AccountType, ACCOUNT_COLORS, ACCOUNT_DESC } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface Props {
  account: AccountType;
  balance: number;
  onEdit: (account: AccountType, newBalance: number) => void;
}

export default function AccountCard({ account, balance, onEdit }: Props) {
  const color = ACCOUNT_COLORS[account];
  const isNegative = balance < 0;
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState("");

  function startEdit() {
    setValue(balance.toFixed(2));
    setEditing(true);
  }

  function confirm() {
    const parsed = parseFloat(value);
    if (!isNaN(parsed)) onEdit(account, parsed);
    setEditing(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") confirm();
    if (e.key === "Escape") setEditing(false);
  }

  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-3 group"
      style={{ backgroundColor: "var(--c-card)", boxShadow: "var(--c-shadow)", border: "1px solid var(--c-card-outline)" }}
    >
      <div className="flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${color}18` }}
        >
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate" style={{ color: "var(--c-t1)" }}>{account}</p>
          <p className="text-xs truncate" style={{ color: "var(--c-t3)" }}>{ACCOUNT_DESC[account]}</p>
        </div>
      </div>

      {editing ? (
        <div className="flex items-center gap-1.5">
          <div className="relative flex-1">
            <span
              className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-semibold"
              style={{ color: "var(--c-t3)" }}
            >
              RM
            </span>
            <input
              type="number"
              step="0.01"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={confirm}
              autoFocus
              className="w-full pl-7 pr-2 py-1.5 text-sm font-bold rounded-lg bg-[var(--c-input)] text-[var(--c-t1)] focus:outline-none focus:ring-2 focus:ring-[#FFCC00]/30"
              style={{ border: "1px solid #FFCC00" }}
            />
          </div>
          <button
            onMouseDown={(e) => { e.preventDefault(); confirm(); }}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold flex-shrink-0 transition-colors"
            style={{ backgroundColor: "#FFCC00", color: "#1a1200" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#E6B800")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#FFCC00")}
          >
            Set
          </button>
        </div>
      ) : (
        <div className="flex items-end justify-between">
          <p
            className="text-xl font-bold tracking-tight"
            style={{ color: isNegative ? "#ef4444" : "var(--c-t1)" }}
          >
            {formatCurrency(balance)}
          </p>
          <button
            onClick={startEdit}
            className="p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[var(--c-hover-2)]"
            style={{ color: "var(--c-t3)" }}
            title="Set balance"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
