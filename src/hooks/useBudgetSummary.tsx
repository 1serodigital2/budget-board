import { getBudgetMonthYear } from "../api/budget";
import { useAuth } from "../context/AuthContext";
import { GetExpenseDetailsType, GetExpenseObjType } from "../types/expense";

const useBudgetSummary = () => {
  const { user } = useAuth();

  const getTotalExpenses = ({ expenses }: GetExpenseObjType) => {
    const totalExpenses = expenses.reduce(
      (total, expense) => total + Number(expense.amount),
      0,
    );
    return totalExpenses;
  };

  return {
    getTotalExpenses,
  };
};

export default useBudgetSummary;
