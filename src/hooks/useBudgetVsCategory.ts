import { getBudgetMonthYear } from "../api/budget";
import { useAuth } from "../context/AuthContext";

const useBudgetVsCategory = async ({ month, expenses, categories }) => {
  const { user } = useAuth();
  const currentMonthBudget = await getBudgetMonthYear({
    monthYear: month,
    uid: user!.uid,
  });

  const groupedExp = expenses.reduce((accumulator, expense) => {
    const { amount, category } = expense;

    if (!accumulator[category]) {
      accumulator[category] = { category, spent: 0 };
    }

    accumulator[category].spent += amount;
    // accumulator[category] = accumulator[category].amount + amount;

    return accumulator;
  }, {});

  const expensesResult = Object.values(groupedExp);
  console.log("expensesResult", expensesResult);

  const expenseWithCatName = expensesResult.map((expense) => {
    return {
      ...expense,
      month,
      budget: currentMonthBudget.find(
        (budget) => expense.category === budget.category,
      )?.amount,
      catName: categories.find((category) => expense.category === category.id)
        ?.name,
    };
  });

  return expenseWithCatName;
  // console.log("expenseWithCatName", expenseWithCatName);
  return { monthlyCategorySpent: expenseWithCatName || [] };
};

export default useBudgetVsCategory;
