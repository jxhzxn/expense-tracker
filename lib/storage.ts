"use client";

import { Expense } from "./types";

const KEY = "expense-tracker-v1";

export function getExpenses(): Expense[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveExpenses(expenses: Expense[]): void {
  localStorage.setItem(KEY, JSON.stringify(expenses));
}

export function addExpense(expense: Omit<Expense, "id" | "createdAt">): Expense {
  const expenses = getExpenses();
  const newExpense: Expense = {
    ...expense,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  saveExpenses([newExpense, ...expenses]);
  return newExpense;
}

export function updateExpense(id: string, data: Omit<Expense, "id" | "createdAt">): void {
  const expenses = getExpenses();
  const updated = expenses.map((e) => (e.id === id ? { ...e, ...data } : e));
  saveExpenses(updated);
}

export function deleteExpense(id: string): void {
  const expenses = getExpenses();
  saveExpenses(expenses.filter((e) => e.id !== id));
}
