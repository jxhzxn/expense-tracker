import React, {
  createContext,
  Dispatch,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import { Expense } from '../types/expense';
import * as storage from '../storage/storage';

type State = { expenses: Expense[] };

type Action =
  | { type: 'LOAD_EXPENSES'; payload: Expense[] }
  | { type: 'ADD_EXPENSE'; payload: Expense };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'LOAD_EXPENSES':
      return { expenses: action.payload };
    case 'ADD_EXPENSE':
      return { expenses: [action.payload, ...state.expenses] };
    default:
      return state;
  }
}

const ExpenseContext = createContext<
  { state: State; dispatch: Dispatch<Action> } | undefined
>(undefined);

export function ExpenseProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { expenses: [] });

  useEffect(() => {
    storage.loadExpenses().then((expenses) => {
      dispatch({ type: 'LOAD_EXPENSES', payload: expenses });
    });
  }, []);

  useEffect(() => {
    storage.saveExpenses(state.expenses);
  }, [state.expenses]);

  return (
    <ExpenseContext.Provider value={{ state, dispatch }}>
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenses() {
  const ctx = useContext(ExpenseContext);
  if (!ctx) throw new Error('useExpenses must be used inside ExpenseProvider');
  return ctx;
}
