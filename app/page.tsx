"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { Expense } from "@/lib/types";
import { getExpenses, addExpense, updateExpense, deleteExpense } from "@/lib/storage";
import { formatCurrency, sumByCategory, groupByMonth, groupByDay } from "@/lib/utils";
import { RangeMode, getRangeForMode, daysBetween } from "@/lib/dateRange";
import StatCard from "@/components/StatCard";
import CategoryChart from "@/components/CategoryChart";
import SpendingChart from "@/components/SpendingChart";
import ExpenseForm from "@/components/ExpenseForm";
import ExpenseRow from "@/components/ExpenseRow";
import RangePicker from "@/components/RangePicker";

export default function Dashboard() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Expense | null>(null);

  const today = new Date().toISOString().slice(0, 10);
  const [rangeMode, setRangeMode] = useState<RangeMode>("payperiod");
  const [customStart, setCustomStart] = useState(today);
  const [customEnd, setCustomEnd] = useState(today);

  const load = useCallback(() => setExpenses(getExpenses()), []);
  useEffect(() => { load(); }, [load]);

  const activeRange = useMemo(
    () => getRangeForMode(rangeMode, customStart, customEnd),
    [rangeMode, customStart, customEnd]
  );

  function handleRangeChange(mode: RangeMode, start?: string, end?: string) {
    setRangeMode(mode);
    if (start) setCustomStart(start);
    if (end) setCustomEnd(end);
  }

  const periodExpenses = useMemo(
    () => expenses.filter((e) => e.date >= activeRange.start && e.date <= activeRange.end),
    [expenses, activeRange]
  );

  const periodTotal = periodExpenses.reduce((s, e) => s + e.amount, 0);
  const allTotal = expenses.reduce((s, e) => s + e.amount, 0);
  const days = daysBetween(activeRange.start, activeRange.end);
  const dailyAvg = periodTotal / days;

  const categoryData = Object.entries(sumByCategory(periodExpenses))
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const spendingData = useMemo(() => {
    if (rangeMode === "week" || rangeMode === "payperiod" || rangeMode === "lastperiod") {
      return groupByDay(periodExpenses, activeRange.start, activeRange.end);
    }
    const rangeDays = daysBetween(activeRange.start, activeRange.end);
    return rangeDays <= 35
      ? groupByDay(periodExpenses, activeRange.start, activeRange.end)
      : groupByMonth(periodExpenses);
  }, [rangeMode, periodExpenses, activeRange]);

  const spendingChartTitle =
    rangeMode === "week"
      ? "Daily Spending (This Week)"
      : rangeMode === "payperiod" || rangeMode === "lastperiod"
      ? "Daily Spending (Pay Period)"
      : "Spending Over Time";

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

  const recentInPeriod = periodExpenses.slice(0, 5);

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[var(--c-t1)]">Dashboard</h1>
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

      <div className="mb-8">
        <RangePicker
          mode={rangeMode}
          customStart={customStart}
          customEnd={customEnd}
          rangeLabel={activeRange.label}
          onChange={handleRangeChange}
        />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard label="Period Total" value={formatCurrency(periodTotal)} sub={`${periodExpenses.length} expense${periodExpenses.length !== 1 ? "s" : ""}`} accent />
        <StatCard label="All Time" value={formatCurrency(allTotal)} sub={`${expenses.length} total expense${expenses.length !== 1 ? "s" : ""}`} />
        <StatCard label="Daily Avg" value={formatCurrency(dailyAvg)} sub={`over ${days} day${days !== 1 ? "s" : ""}`} />
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="rounded-2xl p-5 border" style={{ backgroundColor: "var(--c-card)", borderColor: "var(--c-border)" }}>
          <h2 className="text-sm font-medium text-[var(--c-t2)] mb-4">{spendingChartTitle}</h2>
          <SpendingChart data={spendingData} />
        </div>
        <div className="rounded-2xl p-5 border" style={{ backgroundColor: "var(--c-card)", borderColor: "var(--c-border)" }}>
          <h2 className="text-sm font-medium text-[var(--c-t2)] mb-2">Spending by Category</h2>
          <CategoryChart data={categoryData} />
        </div>
      </div>

      <div className="rounded-2xl p-5 border" style={{ backgroundColor: "var(--c-card)", borderColor: "var(--c-border)" }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-[var(--c-t2)]">
            Recent Expenses
            <span className="ml-2 text-[var(--c-t3)] font-normal">{activeRange.label}</span>
          </h2>
          <Link href="/expenses" className="text-xs transition-colors" style={{ color: "var(--c-accent-text)" }}>
            View all
          </Link>
        </div>
        {recentInPeriod.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[var(--c-t3)] text-sm">No expenses in this period.</p>
            <button
              onClick={() => { setEditTarget(null); setShowForm(true); }}
              className="mt-3 text-sm transition-colors"
              style={{ color: "var(--c-accent-text)" }}
            >
              Add an expense
            </button>
          </div>
        ) : (
          <div className="space-y-1">
            {recentInPeriod.map((e) => (
              <ExpenseRow key={e.id} expense={e} onEdit={(exp) => { setEditTarget(exp); setShowForm(true); }} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

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
