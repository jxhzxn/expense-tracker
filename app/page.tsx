"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { Expense, Income, Transfer, ACCOUNTS, AccountType } from "@/lib/types";
import {
  getExpenses, addExpense, updateExpense, deleteExpense,
  getIncomes, addIncome, updateIncome, deleteIncome,
  getTransfers, addTransfer,
  getBalanceAdjustments, saveBalanceAdjustments,
  getAccountConfigs,
} from "@/lib/storage";
import type { AccountConfig } from "@/lib/types";
import {
  formatCurrency, sumByCategory, groupByMonth, groupByDay,
  groupByMonthTrend, getAccountBalances,
} from "@/lib/utils";
import { RangeMode, getRangeForMode, daysBetween } from "@/lib/dateRange";
import StatCard from "@/components/StatCard";
import CategoryChart from "@/components/CategoryChart";
import SpendingChart from "@/components/SpendingChart";
import TrendChart from "@/components/TrendChart";
import AccountCard from "@/components/AccountCard";
import ExpenseForm from "@/components/ExpenseForm";
import IncomeForm from "@/components/IncomeForm";
import TransferForm from "@/components/TransferForm";
import ExpenseRow from "@/components/ExpenseRow";
import RangePicker from "@/components/RangePicker";
import AnalysisPanel from "@/components/AnalysisPanel";

export default function Dashboard() {
  const [expenses, setExpenses]         = useState<Expense[]>([]);
  const [incomes, setIncomes]           = useState<Income[]>([]);
  const [transfers, setTransfers]       = useState<Transfer[]>([]);
  const [balanceAdj, setBalanceAdj]     = useState<Record<string, number>>({});
  const [accountConfigs, setAccountConfigs] = useState<Record<string, AccountConfig>>(() => getAccountConfigs());

  const [showExpenseForm, setShowExpenseForm]   = useState(false);
  const [editExpense, setEditExpense]           = useState<Expense | null>(null);
  const [showIncomeForm, setShowIncomeForm]     = useState(false);
  const [editIncome, setEditIncome]             = useState<Income | null>(null);
  const [showTransferForm, setShowTransferForm] = useState(false);

  const today = new Date().toISOString().slice(0, 10);
  const [rangeMode, setRangeMode]   = useState<RangeMode>("payperiod");
  const [customStart, setCustomStart] = useState(today);
  const [customEnd, setCustomEnd]     = useState(today);

  const loadAll = useCallback(() => {
    setExpenses(getExpenses());
    setIncomes(getIncomes());
    setTransfers(getTransfers());
    setBalanceAdj(getBalanceAdjustments());
    setAccountConfigs(getAccountConfigs());
  }, []);
  useEffect(() => { loadAll(); }, [loadAll]);

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

  const periodIncomes = useMemo(
    () => incomes.filter((i) => i.date >= activeRange.start && i.date <= activeRange.end),
    [incomes, activeRange]
  );

  const periodTotal  = periodExpenses.reduce((s, e) => s + e.amount, 0);
  const periodIncome = periodIncomes.reduce((s, i) => s + i.amount, 0);
  const days         = daysBetween(activeRange.start, activeRange.end);
  const dailyAvg     = periodTotal / days;

  const rawBalances = useMemo(
    () => getAccountBalances(incomes, transfers, expenses),
    [incomes, transfers, expenses]
  );

  const accountBalances = useMemo(
    () => getAccountBalances(incomes, transfers, expenses, balanceAdj),
    [incomes, transfers, expenses, balanceAdj]
  );

  function handleEditBalance(account: AccountType, newBalance: number) {
    const rawBalance = rawBalances[account];
    const updated = { ...balanceAdj, [account]: newBalance - rawBalance };
    setBalanceAdj(updated);
    saveBalanceAdjustments(updated);
  }

  const trendData = useMemo(
    () => groupByMonthTrend(expenses, incomes),
    [expenses, incomes]
  );

  const categoryData = Object.entries(sumByCategory(periodExpenses))
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const spendingData = useMemo(() => {
    if (rangeMode === "week" || rangeMode === "payperiod" || rangeMode === "lastperiod") {
      return groupByDay(periodExpenses, activeRange.start, activeRange.end);
    }
    return daysBetween(activeRange.start, activeRange.end) <= 35
      ? groupByDay(periodExpenses, activeRange.start, activeRange.end)
      : groupByMonth(periodExpenses);
  }, [rangeMode, periodExpenses, activeRange]);

  const spendingChartTitle =
    rangeMode === "week" ? "Daily Spending (This Week)"
    : rangeMode === "payperiod" || rangeMode === "lastperiod" ? "Daily Spending (Pay Period)"
    : "Spending Over Time";

  function handleSaveExpense(data: Omit<Expense, "id" | "createdAt">) {
    if (editExpense) updateExpense(editExpense.id, data);
    else addExpense(data);
    setShowExpenseForm(false);
    setEditExpense(null);
    loadAll();
  }

  function handleSaveIncome(data: Omit<Income, "id" | "createdAt">) {
    if (editIncome) updateIncome(editIncome.id, data);
    else addIncome(data);
    setShowIncomeForm(false);
    setEditIncome(null);
    loadAll();
  }

  function handleSaveTransfer(data: Omit<Transfer, "id" | "createdAt">) {
    addTransfer(data);
    setShowTransferForm(false);
    loadAll();
  }

  const recentInPeriod = periodExpenses.slice(0, 5);

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[var(--c-t1)]">Dashboard</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTransferForm(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-colors hover:bg-[var(--c-hover)]"
            style={{ border: "1px solid var(--c-border)", color: "var(--c-t2)" }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            Transfer
          </button>
          <button
            onClick={() => { setEditIncome(null); setShowIncomeForm(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-xl font-medium text-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Income
          </button>
          <button
            onClick={() => { setEditExpense(null); setShowExpenseForm(true); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-colors"
            style={{ backgroundColor: "#FFCC00", color: "#1a1200" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#E6B800")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#FFCC00")}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Expense
          </button>
        </div>
      </div>

      {/* Account Balances */}
      <div className="grid grid-cols-4 gap-3 mb-8">
        {ACCOUNTS.map((account) => (
          <AccountCard
            key={account}
            account={account}
            balance={accountBalances[account]}
            config={accountConfigs[account]}
            onEdit={handleEditBalance}
          />
        ))}
      </div>

      {/* Range Picker */}
      <div className="mb-8">
        <RangePicker
          mode={rangeMode}
          customStart={customStart}
          customEnd={customEnd}
          rangeLabel={activeRange.label}
          onChange={handleRangeChange}
        />
      </div>

      {/* Period Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Period Expenses"
          value={formatCurrency(periodTotal)}
          sub={`${periodExpenses.length} expense${periodExpenses.length !== 1 ? "s" : ""}`}
          featured
        />
        <StatCard
          label="Period Income"
          value={formatCurrency(periodIncome)}
          sub={`${periodIncomes.length} income entr${periodIncomes.length !== 1 ? "ies" : "y"}`}
        />
        <StatCard
          label="Daily Avg (Expenses)"
          value={formatCurrency(dailyAvg)}
          sub={`over ${days} day${days !== 1 ? "s" : ""}`}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="rounded-2xl p-5" style={{ backgroundColor: "var(--c-card)", boxShadow: "var(--c-shadow)", border: "1px solid var(--c-card-outline)" }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--c-t2)" }}>{spendingChartTitle}</h2>
          <SpendingChart data={spendingData} />
        </div>
        <div className="rounded-2xl p-5" style={{ backgroundColor: "var(--c-card)", boxShadow: "var(--c-shadow)", border: "1px solid var(--c-card-outline)" }}>
          <h2 className="text-sm font-semibold mb-2" style={{ color: "var(--c-t2)" }}>Spending by Category</h2>
          <CategoryChart data={categoryData} />
        </div>
      </div>

      {/* Trend Chart */}
      <div className="rounded-2xl p-5 mb-8" style={{ backgroundColor: "var(--c-card)", boxShadow: "var(--c-shadow)", border: "1px solid var(--c-card-outline)" }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--c-t2)" }}>Income vs Expenses — Last 6 Months</h2>
        <TrendChart data={trendData} />
      </div>

      {/* Recent Expenses */}
      <div className="rounded-2xl p-5" style={{ backgroundColor: "var(--c-card)", boxShadow: "var(--c-shadow)", border: "1px solid var(--c-card-outline)" }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold" style={{ color: "var(--c-t2)" }}>
            Recent Expenses
            <span className="ml-2 font-normal" style={{ color: "var(--c-t3)" }}>{activeRange.label}</span>
          </h2>
          <Link href="/expenses" className="text-xs transition-colors" style={{ color: "var(--c-accent-text)" }}>
            View all
          </Link>
        </div>
        {recentInPeriod.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[var(--c-t3)] text-sm">No expenses in this period.</p>
            <button
              onClick={() => { setEditExpense(null); setShowExpenseForm(true); }}
              className="mt-3 text-sm transition-colors"
              style={{ color: "var(--c-accent-text)" }}
            >
              Add an expense
            </button>
          </div>
        ) : (
          <div className="space-y-1">
            {recentInPeriod.map((e) => (
              <ExpenseRow
                key={e.id}
                expense={e}
                onEdit={(exp) => { setEditExpense(exp); setShowExpenseForm(true); }}
                onDelete={(id) => { deleteExpense(id); loadAll(); }}
              />
            ))}
          </div>
        )}
      </div>

      {/* AI Analysis */}
      <AnalysisPanel
        data={{
          period: activeRange.label,
          totalExpenses: periodTotal,
          totalIncome: periodIncome,
          days,
          dailyAvg,
          categoryBreakdown: categoryData,
          topExpenses: [...periodExpenses]
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 5)
            .map((e) => ({ note: e.note, amount: e.amount, category: e.category, date: e.date })),
          accountBalances,
        }}
      />

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
          onSave={handleSaveTransfer}
          onClose={() => setShowTransferForm(false)}
        />
      )}
    </>
  );
}
