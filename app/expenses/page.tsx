"use client";

import { useState, useEffect, useCallback } from "react";
import { Expense, Income, Transfer, CATEGORIES, Category, ACCOUNT_COLORS } from "@/lib/types";
import {
  getExpenses, addExpense, updateExpense, deleteExpense,
  getIncomes, addIncome, updateIncome, deleteIncome,
  getTransfers, addTransfer, deleteTransfer,
} from "@/lib/storage";
import { formatCurrency, formatDate } from "@/lib/utils";
import ExpenseForm from "@/components/ExpenseForm";
import IncomeForm from "@/components/IncomeForm";
import TransferForm from "@/components/TransferForm";
import ExpenseRow from "@/components/ExpenseRow";

type Tab = "expenses" | "income" | "transfers";

const inputClass = "bg-[var(--c-input)] border border-[var(--c-input-border)] rounded-xl px-3 py-2 text-sm text-[var(--c-t1)] focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-colors";

export default function TransactionsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("expenses");

  const [expenses, setExpenses]   = useState<Expense[]>([]);
  const [incomes, setIncomes]     = useState<Income[]>([]);
  const [transfers, setTransfers] = useState<Transfer[]>([]);

  const [showExpenseForm, setShowExpenseForm]   = useState(false);
  const [editExpense, setEditExpense]           = useState<Expense | null>(null);
  const [showIncomeForm, setShowIncomeForm]     = useState(false);
  const [editIncome, setEditIncome]             = useState<Income | null>(null);
  const [showTransferForm, setShowTransferForm] = useState(false);

  const [search, setSearch]                   = useState("");
  const [filterCategory, setFilterCategory]   = useState<Category | "All">("All");
  const [sortBy, setSortBy]                   = useState<"date" | "amount">("date");

  const loadAll = useCallback(() => {
    setExpenses(getExpenses());
    setIncomes(getIncomes());
    setTransfers(getTransfers());
  }, []);
  useEffect(() => { loadAll(); }, [loadAll]);

  // ── Expense tab ──────────────────────────────────────────
  const filteredExpenses = expenses
    .filter((e) => {
      const q = search.toLowerCase();
      const matchSearch = e.note.toLowerCase().includes(q) || e.category.toLowerCase().includes(q);
      const matchCategory = filterCategory === "All" || e.category === filterCategory;
      return matchSearch && matchCategory;
    })
    .sort((a, b) => sortBy === "amount" ? b.amount - a.amount : b.date.localeCompare(a.date));

  const groupedExpenses = filteredExpenses.reduce((acc, e) => {
    const m = e.date.slice(0, 7);
    (acc[m] ??= []).push(e);
    return acc;
  }, {} as Record<string, Expense[]>);
  const expenseMonths = Object.keys(groupedExpenses).sort((a, b) => b.localeCompare(a));

  function handleSaveExpense(data: Omit<Expense, "id" | "createdAt">) {
    if (editExpense) updateExpense(editExpense.id, data);
    else addExpense(data);
    setShowExpenseForm(false);
    setEditExpense(null);
    loadAll();
  }

  // ── Income tab ───────────────────────────────────────────
  const filteredIncomes = incomes
    .filter((i) => {
      const q = search.toLowerCase();
      return i.source.toLowerCase().includes(q) || i.note.toLowerCase().includes(q);
    })
    .sort((a, b) => sortBy === "amount" ? b.amount - a.amount : b.date.localeCompare(a.date));

  const groupedIncomes = filteredIncomes.reduce((acc, i) => {
    const m = i.date.slice(0, 7);
    (acc[m] ??= []).push(i);
    return acc;
  }, {} as Record<string, Income[]>);
  const incomeMonths = Object.keys(groupedIncomes).sort((a, b) => b.localeCompare(a));

  function handleSaveIncome(data: Omit<Income, "id" | "createdAt">) {
    if (editIncome) updateIncome(editIncome.id, data);
    else addIncome(data);
    setShowIncomeForm(false);
    setEditIncome(null);
    loadAll();
  }

  // ── Transfers tab ─────────────────────────────────────────
  const filteredTransfers = transfers
    .filter((t) => {
      const q = search.toLowerCase();
      return (
        t.fromAccount.toLowerCase().includes(q) ||
        t.toAccount.toLowerCase().includes(q) ||
        t.note.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => sortBy === "amount" ? b.amount - a.amount : b.date.localeCompare(a.date));

  const groupedTransfers = filteredTransfers.reduce((acc, t) => {
    const m = t.date.slice(0, 7);
    (acc[m] ??= []).push(t);
    return acc;
  }, {} as Record<string, Transfer[]>);
  const transferMonths = Object.keys(groupedTransfers).sort((a, b) => b.localeCompare(a));

  const monthLabel = (key: string) =>
    new Date(key + "-01T00:00:00").toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const tabBtnClass = (tab: Tab) =>
    activeTab === tab
      ? "flex-1 py-2 rounded-lg text-sm font-semibold bg-[var(--c-card)] shadow-sm"
      : "flex-1 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-[var(--c-hover)]";

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--c-t1)]">Transactions</h1>
          {activeTab === "expenses" && filteredExpenses.length > 0 && (
            <p className="text-sm mt-0.5" style={{ color: "var(--c-t2)" }}>
              {filteredExpenses.length} expense{filteredExpenses.length !== 1 ? "s" : ""} · {formatCurrency(filteredExpenses.reduce((s, e) => s + e.amount, 0))}
            </p>
          )}
          {activeTab === "income" && filteredIncomes.length > 0 && (
            <p className="text-sm mt-0.5" style={{ color: "var(--c-t2)" }}>
              {filteredIncomes.length} entr{filteredIncomes.length !== 1 ? "ies" : "y"} · {formatCurrency(filteredIncomes.reduce((s, i) => s + i.amount, 0))}
            </p>
          )}
          {activeTab === "transfers" && filteredTransfers.length > 0 && (
            <p className="text-sm mt-0.5" style={{ color: "var(--c-t2)" }}>
              {filteredTransfers.length} transfer{filteredTransfers.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>
        {activeTab === "expenses" && (
          <button
            onClick={() => { setEditExpense(null); setShowExpenseForm(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium text-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Expense
          </button>
        )}
        {activeTab === "income" && (
          <button
            onClick={() => { setEditIncome(null); setShowIncomeForm(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-xl font-medium text-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Income
          </button>
        )}
        {activeTab === "transfers" && (
          <button
            onClick={() => setShowTransferForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-medium text-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            Transfer
          </button>
        )}
      </div>

      {/* Tabs */}
      <div
        className="flex gap-1 p-1 rounded-xl mb-6"
        style={{ backgroundColor: "var(--c-subtle)", border: "1px solid var(--c-border)" }}
      >
        {(["expenses", "income", "transfers"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={tabBtnClass(tab)}
            style={{ color: activeTab === tab ? "var(--c-t1)" : "var(--c-t2)" }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Filter bar */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--c-t3)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder={activeTab === "expenses" ? "Search expenses..." : activeTab === "income" ? "Search income..." : "Search transfers..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`${inputClass} pl-9 pr-4 w-full`}
          />
        </div>
        {activeTab === "expenses" && (
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value as Category | "All")} className={inputClass}>
            <option value="All">All Categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        )}
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as "date" | "amount")} className={inputClass}>
          <option value="date">Sort by Date</option>
          <option value="amount">Sort by Amount</option>
        </select>
      </div>

      {/* ── Expenses Tab ── */}
      {activeTab === "expenses" && (
        filteredExpenses.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[var(--c-t3)]">
              {expenses.length === 0 ? "No expenses yet." : "No expenses match your filters."}
            </p>
            {expenses.length === 0 && (
              <button
                onClick={() => { setEditExpense(null); setShowExpenseForm(true); }}
                className="mt-3 text-sm transition-colors"
                style={{ color: "var(--c-accent-text)" }}
              >
                Add your first expense
              </button>
            )}
          </div>
        ) : sortBy === "date" ? (
          <div className="space-y-6">
            {expenseMonths.map((month) => {
              const items = groupedExpenses[month];
              const total = items.reduce((s, e) => s + e.amount, 0);
              return (
                <div key={month}>
                  <div className="flex items-center justify-between mb-2 px-4">
                    <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--c-t3)" }}>{monthLabel(month)}</span>
                    <span className="text-xs text-[var(--c-t3)]">{formatCurrency(total)}</span>
                  </div>
                  <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "var(--c-card)", boxShadow: "var(--c-shadow)" }}>
                    <div className="divide-y divide-[var(--c-divide)]">
                      {items.map((e) => (
                        <ExpenseRow key={e.id} expense={e} onEdit={(exp) => { setEditExpense(exp); setShowExpenseForm(true); }} onDelete={(id) => { deleteExpense(id); loadAll(); }} />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "var(--c-card)", boxShadow: "var(--c-shadow)" }}>
            <div className="divide-y divide-[var(--c-divide)]">
              {filteredExpenses.map((e) => (
                <ExpenseRow key={e.id} expense={e} onEdit={(exp) => { setEditExpense(exp); setShowExpenseForm(true); }} onDelete={(id) => { deleteExpense(id); loadAll(); }} />
              ))}
            </div>
          </div>
        )
      )}

      {/* ── Income Tab ── */}
      {activeTab === "income" && (
        filteredIncomes.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[var(--c-t3)]">
              {incomes.length === 0 ? "No income entries yet." : "No income matches your search."}
            </p>
            {incomes.length === 0 && (
              <button
                onClick={() => { setEditIncome(null); setShowIncomeForm(true); }}
                className="mt-3 text-sm transition-colors"
                style={{ color: "var(--c-accent-text)" }}
              >
                Add your first income
              </button>
            )}
          </div>
        ) : sortBy === "date" ? (
          <div className="space-y-6">
            {incomeMonths.map((month) => {
              const items = groupedIncomes[month];
              const total = items.reduce((s, i) => s + i.amount, 0);
              return (
                <div key={month}>
                  <div className="flex items-center justify-between mb-2 px-4">
                    <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--c-t3)" }}>{monthLabel(month)}</span>
                    <span className="text-xs text-green-500">+{formatCurrency(total)}</span>
                  </div>
                  <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "var(--c-card)", boxShadow: "var(--c-shadow)" }}>
                    <div className="divide-y divide-[var(--c-divide)]">
                      {items.map((i) => {
                        const acColor = ACCOUNT_COLORS[i.account];
                        return (
                          <div key={i.id} className="flex items-center gap-4 px-4 py-3 hover:bg-[var(--c-hover)] transition-colors group">
                            <div className="w-2 h-2 rounded-full flex-shrink-0 bg-green-500" />
                            <div className="flex-1 min-w-0">
                              <p className="text-[var(--c-t1)] text-sm font-medium truncate">{i.source}</p>
                              <div className="flex items-center gap-2">
                                <p className="text-[var(--c-t3)] text-xs">{formatDate(i.date)}</p>
                                <span
                                  className="text-xs px-1.5 py-0.5 rounded-md font-medium leading-none"
                                  style={{ backgroundColor: `${acColor}20`, color: acColor }}
                                >
                                  {i.account}
                                </span>
                                {i.note && <p className="text-[var(--c-t3)] text-xs truncate">· {i.note}</p>}
                              </div>
                            </div>
                            <span className="text-green-500 font-semibold text-sm flex-shrink-0">+{formatCurrency(i.amount)}</span>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                              <button
                                onClick={() => { setEditIncome(i); setShowIncomeForm(true); }}
                                className="p-1.5 rounded-lg text-[var(--c-t2)] hover:text-[var(--c-t1)] hover:bg-[var(--c-hover-2)] transition-colors"
                                title="Edit"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => { deleteIncome(i.id); loadAll(); }}
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
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "var(--c-card)", boxShadow: "var(--c-shadow)" }}>
            <div className="divide-y divide-[var(--c-divide)]">
              {filteredIncomes.map((i) => {
                const acColor = ACCOUNT_COLORS[i.account];
                return (
                  <div key={i.id} className="flex items-center gap-4 px-4 py-3 hover:bg-[var(--c-hover)] transition-colors group">
                    <div className="w-2 h-2 rounded-full flex-shrink-0 bg-green-500" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[var(--c-t1)] text-sm font-medium truncate">{i.source}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-[var(--c-t3)] text-xs">{formatDate(i.date)}</p>
                        <span
                          className="text-xs px-1.5 py-0.5 rounded-md font-medium leading-none"
                          style={{ backgroundColor: `${acColor}20`, color: acColor }}
                        >
                          {i.account}
                        </span>
                        {i.note && <p className="text-[var(--c-t3)] text-xs truncate">· {i.note}</p>}
                      </div>
                    </div>
                    <span className="text-green-500 font-semibold text-sm flex-shrink-0">+{formatCurrency(i.amount)}</span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      <button
                        onClick={() => { setEditIncome(i); setShowIncomeForm(true); }}
                        className="p-1.5 rounded-lg text-[var(--c-t2)] hover:text-[var(--c-t1)] hover:bg-[var(--c-hover-2)] transition-colors"
                        title="Edit"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => { deleteIncome(i.id); loadAll(); }}
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
              })}
            </div>
          </div>
        )
      )}

      {/* ── Transfers Tab ── */}
      {activeTab === "transfers" && (
        filteredTransfers.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[var(--c-t3)]">
              {transfers.length === 0 ? "No transfers yet." : "No transfers match your search."}
            </p>
            {transfers.length === 0 && (
              <button
                onClick={() => setShowTransferForm(true)}
                className="mt-3 text-sm transition-colors"
                style={{ color: "var(--c-accent-text)" }}
              >
                Add your first transfer
              </button>
            )}
          </div>
        ) : sortBy === "date" ? (
          <div className="space-y-6">
            {transferMonths.map((month) => {
              const items = groupedTransfers[month];
              return (
                <div key={month}>
                  <div className="flex items-center justify-between mb-2 px-4">
                    <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--c-t3)" }}>{monthLabel(month)}</span>
                    <span className="text-xs text-[var(--c-t3)]">{items.length} transfer{items.length !== 1 ? "s" : ""}</span>
                  </div>
                  <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "var(--c-card)", boxShadow: "var(--c-shadow)" }}>
                    <div className="divide-y divide-[var(--c-divide)]">
                      {items.map((t) => <TransferRow key={t.id} transfer={t} onDelete={(id) => { deleteTransfer(id); loadAll(); }} />)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "var(--c-card)", boxShadow: "var(--c-shadow)" }}>
            <div className="divide-y divide-[var(--c-divide)]">
              {filteredTransfers.map((t) => <TransferRow key={t.id} transfer={t} onDelete={(id) => { deleteTransfer(id); loadAll(); }} />)}
            </div>
          </div>
        )
      )}

      {showExpenseForm && (
        <ExpenseForm
          expense={editExpense}
          onSave={handleSaveExpense}
          onClose={() => { setShowExpenseForm(false); setEditExpense(null); }}
        />
      )}
      {showIncomeForm && (
        <IncomeForm
          income={editIncome}
          onSave={handleSaveIncome}
          onClose={() => { setShowIncomeForm(false); setEditIncome(null); }}
        />
      )}
      {showTransferForm && (
        <TransferForm
          onSave={(data) => { addTransfer(data); setShowTransferForm(false); loadAll(); }}
          onClose={() => setShowTransferForm(false)}
        />
      )}
    </>
  );
}

function TransferRow({ transfer: t, onDelete }: { transfer: Transfer; onDelete: (id: string) => void }) {
  const fromColor = ACCOUNT_COLORS[t.fromAccount];
  const toColor   = ACCOUNT_COLORS[t.toAccount];
  return (
    <div className="flex items-center gap-4 px-4 py-3 hover:bg-[var(--c-hover)] transition-colors group">
      <div className="w-6 h-6 rounded-lg bg-sky-500/10 flex items-center justify-center flex-shrink-0">
        <svg className="w-3.5 h-3.5 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 text-sm">
          <span className="font-medium" style={{ color: fromColor }}>{t.fromAccount}</span>
          <span className="text-[var(--c-t3)]">→</span>
          <span className="font-medium" style={{ color: toColor }}>{t.toAccount}</span>
        </div>
        <p className="text-[var(--c-t3)] text-xs">
          {formatDate(t.date)}{t.note ? ` · ${t.note}` : ""}
        </p>
      </div>
      <span className="text-sky-500 font-semibold text-sm flex-shrink-0">{formatCurrency(t.amount)}</span>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        <button
          onClick={() => onDelete(t.id)}
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
