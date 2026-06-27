"use client";

import { Expense, Income, Transfer } from "./types";

const KEYS = {
  expenses:   "expense-tracker-v1",
  income:     "expense-tracker-income-v1",
  transfers:  "expense-tracker-transfers-v1",
  categories: "expense-tracker-categories-v1",
};

export const DEFAULT_CATEGORIES = [
  "Food & Drink",
  "Transport",
  "Shopping",
  "Entertainment",
  "Health",
  "Housing",
  "Travel",
  "Other",
];

function read<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function write<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

// ── Expenses ──────────────────────────────────────────────
export function getExpenses(): Expense[] { return read<Expense>(KEYS.expenses); }

export function addExpense(expense: Omit<Expense, "id" | "createdAt">): Expense {
  const expenses = getExpenses();
  const item: Expense = { ...expense, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
  write(KEYS.expenses, [item, ...expenses]);
  return item;
}

export function updateExpense(id: string, data: Omit<Expense, "id" | "createdAt">): void {
  write(KEYS.expenses, getExpenses().map((e) => (e.id === id ? { ...e, ...data } : e)));
}

export function deleteExpense(id: string): void {
  write(KEYS.expenses, getExpenses().filter((e) => e.id !== id));
}

// ── Income ────────────────────────────────────────────────
export function getIncomes(): Income[] { return read<Income>(KEYS.income); }

export function addIncome(income: Omit<Income, "id" | "createdAt">): Income {
  const incomes = getIncomes();
  const item: Income = { ...income, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
  write(KEYS.income, [item, ...incomes]);
  return item;
}

export function updateIncome(id: string, data: Omit<Income, "id" | "createdAt">): void {
  write(KEYS.income, getIncomes().map((i) => (i.id === id ? { ...i, ...data } : i)));
}

export function deleteIncome(id: string): void {
  write(KEYS.income, getIncomes().filter((i) => i.id !== id));
}

// ── Transfers ─────────────────────────────────────────────
export function getTransfers(): Transfer[] { return read<Transfer>(KEYS.transfers); }

export function addTransfer(transfer: Omit<Transfer, "id" | "createdAt">): Transfer {
  const transfers = getTransfers();
  const item: Transfer = { ...transfer, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
  write(KEYS.transfers, [item, ...transfers]);
  return item;
}

export function deleteTransfer(id: string): void {
  write(KEYS.transfers, getTransfers().filter((t) => t.id !== id));
}

// ── Categories ────────────────────────────────────────────────
export function getCategories(): string[] {
  const stored = read<string>(KEYS.categories);
  return stored.length > 0 ? stored : [...DEFAULT_CATEGORIES];
}

export function saveCategories(cats: string[]): void {
  write(KEYS.categories, cats);
}

// ── Nuclear option ────────────────────────────────────────────
export function clearAllData(): void {
  Object.values(KEYS).forEach((key) => localStorage.removeItem(key));
}
