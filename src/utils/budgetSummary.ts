import type {
  Budget,
  BudgetLine,
  BudgetStatus,
  BudgetSummary,
  UnbudgetedSpend,
} from "../types/budget";
import type { Category } from "../types/category";
import type { Expense } from "../types/expense";

export const NEAR_LIMIT_PERCENT = 80;

export const budgetStatus = (percentage: number): BudgetStatus =>
  percentage > 100 ? "over" : percentage >= NEAR_LIMIT_PERCENT ? "near-limit" : "on-track";

/**
 * Combines one month's budgets and expenses into per-category lines.
 * `expenses` must already be limited to that month.
 */
export const buildBudgetSummary = (
  budgets: Budget[],
  expenses: Expense[],
  categories: Category[],
): BudgetSummary => {
  const categoryById = new Map(categories.map((c) => [c.id, c]));

  const spentByCategory = new Map<number, number>();
  let totalSpent = 0;
  for (const expense of expenses) {
    spentByCategory.set(
      expense.categoryId,
      (spentByCategory.get(expense.categoryId) ?? 0) + expense.amount,
    );
    totalSpent += expense.amount;
  }

  const lines: BudgetLine[] = budgets.map((budget) => {
    const category = categoryById.get(budget.categoryId);
    const spent = spentByCategory.get(budget.categoryId) ?? 0;
    const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
    return {
      budgetId: budget.id,
      categoryId: budget.categoryId,
      categoryName: category?.name ?? "Deleted category",
      categoryColor: category?.color ?? "#94a3b8",
      budget: budget.amount,
      spent,
      remaining: budget.amount - spent,
      percentage,
      status: budgetStatus(percentage),
    };
  });
  lines.sort((a, b) => b.percentage - a.percentage);

  const budgeted = new Set(budgets.map((b) => b.categoryId));
  const unbudgeted: UnbudgetedSpend[] = [...spentByCategory.entries()]
    .filter(([categoryId]) => !budgeted.has(categoryId))
    .map(([categoryId, spent]) => {
      const category = categoryById.get(categoryId);
      return {
        categoryId,
        categoryName: category?.name ?? "Uncategorized",
        categoryColor: category?.color ?? "#94a3b8",
        spent,
      };
    })
    .sort((a, b) => b.spent - a.spent);

  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
  const budgetedSpent = lines.reduce((sum, l) => sum + l.spent, 0);

  return {
    totalBudget,
    budgetedSpent,
    totalSpent,
    remaining: totalBudget - totalSpent,
    lines,
    unbudgeted,
  };
};
