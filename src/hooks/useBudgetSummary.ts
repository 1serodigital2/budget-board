import { BudgetsObjTypes, GetBudgetDetailsTypes } from "../types/budget";
import { GetExpenseDetailsType, GetExpenseObjType } from "../types/expense";

interface BudgetSummaryTypes {
  budgets?: GetBudgetDetailsTypes[];
  expenses?: GetExpenseDetailsType[];
}

const useBudgetSummary = ({
  budgets = [],
  expenses = [],
}: BudgetSummaryTypes) => {
  const totalExpenses = expenses.reduce(
    (total, expense) => total + Number(expense.amount),
    0,
  );
  const totalBudget = budgets.reduce(
    (total, budget) => total + Number(budget.amount),
    0,
  );
  const remainingBudget = totalBudget - totalExpenses;

  const utilization = totalBudget > 0 ? (totalExpenses / totalBudget) * 100 : 0;

  const budgetPercentageSpent = utilization.toFixed(2);

  return {
    totalExpenses,
    totalBudget,
    budgetPercentageSpent,
    remainingBudget,
  };
};

export default useBudgetSummary;
