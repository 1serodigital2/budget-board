import { useQuery } from "@tanstack/react-query";
import { getExpenses, getExpensesMonthYear } from "../api/expenses";
import { useAuth } from "../context/AuthContext";
import { DateRange } from "../types/expense";

const useExpenses = () => {
  const { user } = useAuth();
  const useGetExpenseMonthYear = (monthYear: string) => {
    return useQuery({
      queryKey: ["expenses", monthYear],
      queryFn: () => getExpensesMonthYear({ uid: user!.uid, monthYear }),
    });
  };

  const useGetExpensesQuery = ({
    category,
    dateRange,
  }: {
    category?: string;
    dateRange?: DateRange;
  }) => {
    return useQuery({
      queryKey: [
        "expenses",
        category,
        dateRange?.start?.toISOString(),
        dateRange?.end?.toISOString(),
      ],
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
