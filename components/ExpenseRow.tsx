"use client";

import { Expense, ACCOUNT_COLORS } from "@/lib/types";
import { formatCurrency, formatDate, getCategoryColor } from "@/lib/utils";

interface Props {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

export default function ExpenseRow({ expense, onEdit, onDelete }: Props) {
  const color = getCategoryColor(expense.category);
  const accountColor = expense.account ? ACCOUNT_COLORS[expense.account] : null;

  return (
    <div className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-[var(--c-hover)] transition-colors group">
      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
      <div className="flex-1 min-w-0">
        <p className="text-[var(--c-t1)] text-sm font-medium truncate">
          {expense.note || expense.category}
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-[var(--c-t3)] text-xs">
            {expense.category} · {formatDate(expense.date)}
          </p>
          {expense.account && accountColor && (
            <span
              className="text-xs px-1.5 py-0.5 rounded-md font-medium leading-none"
              style={{ backgroundColor: `${accountColor}20`, color: accountColor }}
            >
              {expense.account}
            </span>
          )}
        </div>
      </div>
      <span className="text-[var(--c-t1)] font-semibold text-sm flex-shrink-0">
        {formatCurrency(expense.amount)}
      </span>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        <button
          onClick={() => onEdit(expense)}
          className="p-1.5 rounded-lg text-[var(--c-t2)] hover:text-[var(--c-t1)] hover:bg-[var(--c-hover-2)] transition-colors"
          title="Edit"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          onClick={() => onDelete(expense.id)}
          className="p-1.5 rounded-lg text-[var(--c-t2)] hover:text-red-500 hover:bg-[var(--c-hover-2)] transition-colors"
          title="Delete"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}
