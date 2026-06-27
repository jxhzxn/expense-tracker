import { Expense } from "./types";

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
    .map(([key, total]) => ({
      label: getMonthLabel(key + "-01"),
      total,
    }));
}

export function groupByDay(
  expenses: Expense[],
  start: string,
  end: string
): { label: string; total: number }[] {
  const map: Record<string, number> = {};
  expenses.forEach((e) => {
    map[e.date] = (map[e.date] || 0) + e.amount;
  });

  const result: { label: string; total: number }[] = [];
  const cur = new Date(start + "T00:00:00");
  const endDate = new Date(end + "T00:00:00");
  while (cur <= endDate) {
    const dateStr = cur.toISOString().slice(0, 10);
    result.push({
      label: cur.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      total: map[dateStr] ?? 0,
    });
    cur.setDate(cur.getDate() + 1);
  }
  return result;
}
