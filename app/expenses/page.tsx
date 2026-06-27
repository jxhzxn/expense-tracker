"use client";

import { useState, useEffect, useCallback } from "react";
import { Expense, CATEGORIES, Category } from "@/lib/types";
import { getExpenses, addExpense, updateExpense, deleteExpense } from "@/lib/storage";
import { formatCurrency } from "@/lib/utils";
import ExpenseForm from "@/components/ExpenseForm";
import ExpenseRow from "@/components/ExpenseRow";

const inputClass = "bg-[var(--c-card)] border border-[var(--c-border)] rounded-xl px-3 py-2 text-sm text-[var(--c-t1)] focus:outline-none focus:border-indigo-500";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Expense | null>(null);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<Category | "All">("All");
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");

  const load = useCallback(() => setExpenses(getExpenses()), []);
  useEffect(() => { load(); }, [load]);

  const filtered = expenses
    .filter((e) => {
      const matchSearch =
        e.note.toLowerCase().includes(search.toLowerCase()) ||
        e.category.toLowerCase().includes(search.toLowerCase());
      const matchCategory = filterCategory === "All" || e.category === filterCategory;
      return matchSearch && matchCategory;
    })
    .sort((a, b) => sortBy === "amount" ? b.amount - a.amount : b.date.localeCompare(a.date));

  const totalFiltered = filtered.reduce((s, e) => s + e.amount, 0);

  function handleSave(data: Omit<Expense, "id" | "createdAt">) {
    if (editTarget) {
      updateExpense(editTarget.id, data);
    } else {
      addExpense(data);
    }
    setShowForm(false);
    setEditTarget(null);
    load();
  }

  function handleDelete(id: string) {
    deleteExpense(id);
    load();
  }

  const grouped = filtered.reduce((acc, e) => {
    const month = e.date.slice(0, 7);
    if (!acc[month]) acc[month] = [];
    acc[month].push(e);
    return acc;
  }, {} as Record<string, Expense[]>);

  const months = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--c-t1)]">All Expenses</h1>
          {filtered.length > 0 && (
            <p className="text-[var(--c-t2)] text-sm mt-0.5">
              {filtered.length} expense{filtered.length !== 1 ? "s" : ""} · {formatCurrency(totalFiltered)}
            </p>
          )}
        </div>
        <button
          onClick={() => { setEditTarget(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium text-sm transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Expense
        </button>
      </div>

      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--c-t3)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search expenses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`${inputClass} pl-9 pr-4 w-full`}
          />
        </div>
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value as Category | "All")} className={inputClass}>
          <option value="All">All Categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as "date" | "amount")} className={inputClass}>
          <option value="date">Sort by Date</option>
          <option value="amount">Sort by Amount</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-[var(--c-t3)]">
            {expenses.length === 0 ? "No expenses yet." : "No expenses match your filters."}
          </p>
          {expenses.length === 0 && (
            <button
              onClick={() => { setEditTarget(null); setShowForm(true); }}
              className="mt-3 text-sm transition-colors"
              style={{ color: "var(--c-accent-text)" }}
            >
              Add your first expense
            </button>
          )}
        </div>
      ) : sortBy === "date" ? (
        <div className="space-y-6">
          {months.map((month) => {
            const items = grouped[month];
            const total = items.reduce((s, e) => s + e.amount, 0);
            const label = new Date(month + "-01T00:00:00").toLocaleDateString("en-US", { month: "long", year: "numeric" });
            return (
              <div key={month}>
                <div className="flex items-center justify-between mb-2 px-4">
                  <span className="text-xs font-medium text-[var(--c-t3)] uppercase tracking-wider">{label}</span>
                  <span className="text-xs text-[var(--c-t3)]">{formatCurrency(total)}</span>
                </div>
                <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: "var(--c-card)", borderColor: "var(--c-border)" }}>
                  <div className="divide-y divide-[var(--c-divide)]">
                    {items.map((e) => (
                      <ExpenseRow key={e.id} expense={e} onEdit={(exp) => { setEditTarget(exp); setShowForm(true); }} onDelete={handleDelete} />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: "var(--c-card)", borderColor: "var(--c-border)" }}>
          <div className="divide-y divide-[var(--c-divide)]">
            {filtered.map((e) => (
              <ExpenseRow key={e.id} expense={e} onEdit={(exp) => { setEditTarget(exp); setShowForm(true); }} onDelete={handleDelete} />
            ))}
          </div>
        </div>
      )}

      {showForm && (
        <ExpenseForm
          expense={editTarget}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditTarget(null); }}
        />
      )}
    </>
  );
}
