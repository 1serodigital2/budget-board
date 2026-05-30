import { useQuery } from "@tanstack/react-query";
import { getExpensesMonthYear } from "../api/expenses";
import { useAuth } from "../context/AuthContext";

const useExpenses = () => {
  const { user } = useAuth();
  const useGetExpenseMonthYear = (monthYear: string) => {
    return useQuery({
      queryKey: ["expenses", monthYear],
      queryFn: () => getExpensesMonthYear({ uid: user!.uid, monthYear }),
    });
  };

  return {
    useGetExpenseMonthYear,
  };
};

export default useExpenses;
