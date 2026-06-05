import { useQuery } from "@tanstack/react-query";
import { getExpenses, getExpensesMonthYear } from "../api/expenses";
import { useAuth } from "../context/AuthContext";

const useExpenses = () => {
  const { user } = useAuth();
  const useGetExpenseMonthYear = (monthYear: string) => {
    return useQuery({
      queryKey: ["expenses", monthYear],
      queryFn: () => getExpensesMonthYear({ uid: user!.uid, monthYear }),
    });
  };

  const useGetExpensesQuery = ({ category, dateRange }) => {
    return useQuery({
      queryKey: ["expenses", category, dateRange],
      queryFn: () => getExpenses(user!.uid, category, dateRange),
      enabled: !!user!.uid,
    });
  };

  return {
    useGetExpenseMonthYear,
    useGetExpensesQuery,
  };
};

export default useExpenses;
