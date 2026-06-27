import { Expense, Income, Transfer, AccountType, ACCOUNTS } from "./types";

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "MYR",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getMonthLabel(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export function sumByCategory(expenses: Expense[]): Record<string, number> {
  return expenses.reduce(
    (acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    },
    {} as Record<string, number>
  );
}

export function groupByMonth(expenses: Expense[]): { label: string; total: number }[] {
  const map: Record<string, number> = {};
  expenses.forEach((e) => {
    const key = e.date.slice(0, 7);
    map[key] = (map[key] || 0) + e.amount;
  });
  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([key, total]) => ({ label: getMonthLabel(key + "-01"), total }));
}

export function groupByDay(
  expenses: Expense[],
  start: string,
  end: string
): { label: string; total: number }[] {
  const map: Record<string, number> = {};
  expenses.forEach((e) => { map[e.date] = (map[e.date] || 0) + e.amount; });
  const result: { label: string; total: number }[] = [];
  const cur = new Date(start + "T00:00:00");
  const endDate = new Date(end + "T00:00:00");
  while (cur <= endDate) {
    const y = cur.getFullYear();
    const m = String(cur.getMonth() + 1).padStart(2, "0");
    const d = String(cur.getDate()).padStart(2, "0");
    const dateStr = `${y}-${m}-${d}`;
    result.push({
      label: cur.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      total: map[dateStr] ?? 0,
    });
    cur.setDate(cur.getDate() + 1);
  }
  return result;
}

/** Income vs Expense grouped chart — last 6 months */
export function groupByMonthTrend(
  expenses: Expense[],
  incomes: Income[]
): { month: string; income: number; expense: number }[] {
  const monthsSet = new Set<string>();
  expenses.forEach((e) => monthsSet.add(e.date.slice(0, 7)));
  incomes.forEach((i) => monthsSet.add(i.date.slice(0, 7)));

  const months = Array.from(monthsSet).sort().slice(-6);

  return months.map((key) => ({
    month: getMonthLabel(key + "-01"),
    income: incomes.filter((i) => i.date.startsWith(key)).reduce((s, i) => s + i.amount, 0),
    expense: expenses.filter((e) => e.date.startsWith(key)).reduce((s, e) => s + e.amount, 0),
  }));
}

/** Current balance per account */
export function getAccountBalances(
  incomes: Income[],
  transfers: Transfer[],
  expenses: Expense[]
): Record<AccountType, number> {
  const bal = Object.fromEntries(ACCOUNTS.map((a) => [a, 0])) as Record<AccountType, number>;
  incomes.forEach((i) => { bal[i.account] += i.amount; });
  transfers.forEach((t) => { bal[t.toAccount] += t.amount; bal[t.fromAccount] -= t.amount; });
  expenses.forEach((e) => { if (e.account) bal[e.account] -= e.amount; });
  return bal;
}
