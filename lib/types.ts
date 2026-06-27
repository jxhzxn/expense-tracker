export type Category =
  | "Food & Drink"
  | "Transport"
  | "Shopping"
  | "Entertainment"
  | "Health"
  | "Housing"
  | "Travel"
  | "Other";

export const CATEGORIES: Category[] = [
  "Food & Drink",
  "Transport",
  "Shopping",
  "Entertainment",
  "Health",
  "Housing",
  "Travel",
  "Other",
];

export const CATEGORY_COLORS: Record<Category, string> = {
  "Food & Drink": "#f97316",
  Transport: "#3b82f6",
  Shopping: "#a855f7",
  Entertainment: "#ec4899",
  Health: "#22c55e",
  Housing: "#eab308",
  Travel: "#06b6d4",
  Other: "#6b7280",
};

export interface Expense {
  id: string;
  amount: number;
  category: Category;
  date: string;
  note: string;
  createdAt: string;
}
