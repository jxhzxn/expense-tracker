export type Category = string;

export const CATEGORY_COLORS: Record<string, string> = {
  "Food & Drink": "#f97316",
  Transport: "#3b82f6",
  Shopping: "#a855f7",
  Entertainment: "#ec4899",
  Health: "#22c55e",
  Housing: "#eab308",
  Travel: "#06b6d4",
  Other: "#6b7280",
};

export type AccountType = "Bank Savings" | "TNG Visa" | "Wise" | "TNG Transit";

export const ACCOUNTS: AccountType[] = [
  "Bank Savings",
  "TNG Visa",
  "Wise",
  "TNG Transit",
];

export const ACCOUNT_COLORS: Record<AccountType, string> = {
  "Bank Savings": "#22c55e",
  "TNG Visa":     "#6366f1",
  "Wise":         "#0ea5e9",
  "TNG Transit":  "#f97316",
};

export const ACCOUNT_DESC: Record<AccountType, string> = {
  "Bank Savings": "Salary account",
  "TNG Visa":     "Daily expenses · ~RM600/mo",
  "Wise":         "Cabs, food delivery, subs · ~RM200/mo",
  "TNG Transit":  "MRT / LRT / Bus · ~RM100/mo",
};

export interface AccountConfig {
  color: string;
  icon: string;
}

export const DEFAULT_ACCOUNT_CONFIGS: Record<AccountType, AccountConfig> = {
  "Bank Savings": { color: "#22c55e", icon: "bank" },
  "TNG Visa":     { color: "#6366f1", icon: "card" },
  "Wise":         { color: "#0ea5e9", icon: "globe" },
  "TNG Transit":  { color: "#f97316", icon: "train" },
};

export interface Expense {
  id: string;
  amount: number;
  category: Category;
  date: string;
  note: string;
  account?: AccountType;
  createdAt: string;
}

export interface Income {
  id: string;
  amount: number;
  source: string;
  date: string;
  note: string;
  account: AccountType;
  createdAt: string;
}

export interface Transfer {
  id: string;
  fromAccount: AccountType;
  toAccount: AccountType;
  amount: number;
  date: string;
  note: string;
  createdAt: string;
}
