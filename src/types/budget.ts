export interface Budget {
  id: number;
  amount: number;
  categoryId: number;
  /** "YYYY-MM" */
  month: string;
  createdAt: string;
}

export interface BudgetInput {
  categoryId: number;
  amount: number;
  /** "YYYY-MM" */
  month: string;
}

export type BudgetStatus = "on-track" | "near-limit" | "over";

export interface BudgetLine {
  budgetId: number;
  categoryId: number;
  categoryName: string;
  categoryColor: string;
  budget: number;
  spent: number;
  remaining: number;
  percentage: number;
  status: BudgetStatus;
}

export interface UnbudgetedSpend {
  categoryId: number;
  categoryName: string;
  categoryColor: string;
  spent: number;
}

export interface BudgetSummary {
  totalBudget: number;
  /** Spend in budgeted categories */
  budgetedSpent: number;
  /** All spend in the month, budgeted or not */
  totalSpent: number;
  remaining: number;
  lines: BudgetLine[];
  unbudgeted: UnbudgetedSpend[];
}
