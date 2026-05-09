import AsyncStorage from '@react-native-async-storage/async-storage';
import { Expense } from '../types/expense';

const STORAGE_KEY = '@expense_tracker_expenses';

export async function loadExpenses(): Promise<Expense[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function saveExpenses(expenses: Expense[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
}
