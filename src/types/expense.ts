export type Category =
  | 'Food'
  | 'Transport'
  | 'Shopping'
  | 'Health'
  | 'Entertainment'
  | 'Utilities'
  | 'Other';

export const CATEGORIES: Category[] = [
  'Food',
  'Transport',
  'Shopping',
  'Health',
  'Entertainment',
  'Utilities',
  'Other',
];

export interface Expense {
  id: string;
  amount: number;
  category: Category;
  createdAt: string; // ISO 8601
}

export type SortOption = 'newest' | 'oldest' | 'highest' | 'lowest';
