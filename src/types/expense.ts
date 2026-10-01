export interface Expense {
  id: number;
  amount: number;
  categoryId: number;
  note: string;
  /** Calendar date, "YYYY-MM-DD" */
  date: string;
  createdAt: string;
}

export interface ExpenseInput {
  amount: number;
  categoryId: number;
  /** Calendar date, "YYYY-MM-DD" */
  date: string;
  note: string;
}

export interface ExpenseFilters {
  categoryId?: number;
  /** Case-insensitive match anywhere in the note */
  search?: string;
  /** Inclusive "YYYY-MM-DD" */
  from?: string;
  /** Inclusive "YYYY-MM-DD" */
  to?: string;
}

export interface ExpensePage {
  expenses: Expense[];
  total: number;
  nextOffset: number | null;
}

export interface MonthlyTrendPoint {
  /** "YYYY-MM" */
  month: string;
  label: string;
  expense: number;
  budget: number;
}
