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
  const groupedExp = expenses.reduce<Record<string, GroupedExpense>>((accumulator, expense) => {
    const { amount, category } = expense;

    if (!accumulator[category]) {
      accumulator[category] = { category, spent: 0 };
    }

    accumulator[category].spent += amount;

    return accumulator;
  }, {});

  const expensesResult = Object.values(groupedExp);
  console.log("expensesResult", expensesResult);

  const expenseWithCatName = expensesResult.map((expense: GroupedExpense) => {
    return {
      ...expense,
      month,
      budget: Number(budgets.find((budget) => expense.category === budget.category)
        ?.amount) || 0,
      category: categories.find((category) => expense.category === category.id)
        ?.name,
    };
  });

  return expenseWithCatName;
};

export default useBudgetVsCategory;
