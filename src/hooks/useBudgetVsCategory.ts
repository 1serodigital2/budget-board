import { BudgetVsCategoryTypes } from "../types/budget";

type GroupedExpense = {
  category: string;
  spent: number;
};

const useBudgetVsCategory = ({
  month,
  budgets,
  expenses,
  categories,
}: BudgetVsCategoryTypes) => {
  const groupedExp = expenses.reduce<Record<string, GroupedExpense>>(
    (acc, expense) => {
      if (!acc[expense.category.toString()]) {
        acc[expense.category.toString()] = {
          category: expense.category.toString(),
          spent: 0,
        };
      }

      acc[expense.category.toString()].spent += expense.amount;

      return acc;
    },
    {},
  );

  const expensesResult = Object.values(groupedExp);

  const expenseCategories = new Set(
    expensesResult.map((expense) => expense.category.toString()),
  );

  const budgetMap = new Map(
    budgets.map((budget) => [budget.category.toString(), budget.amount]),
  );

  const categoryMap = new Map(
    categories.map((category) => [category.id, category.name]),
  );

  const expenseWithCatName = expensesResult.map((expense) => ({
    ...expense,
    month,
    budget: budgetMap.get(expense.category.toString()) ?? 0,
    category: categoryMap.get(Number(expense.category)),
  }));

  const budgetWithNoExpense = budgets.filter(
    (budget) => !expenseCategories.has(budget.category.toString()),
  );

  const emptyBudget = budgetWithNoExpense.map((budget) => ({
    spent: 0,
    category: categoryMap.get(Number(budget.category)),
    month,
    budget: budget.amount,
  }));

  return [...expenseWithCatName, ...emptyBudget];
};

export default useBudgetVsCategory;
