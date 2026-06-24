import { useQuery } from "@tanstack/react-query";
import { getMonthlyExpenses } from "../api/expenses";
import { useAuth } from "../context/AuthContext";
import { DateFilter } from "../utils/helpers";

const useEpxenseTrend = () => {
  const { user } = useAuth();

  const useMonthlyExpenseTrend = (month: DateFilter) => {
    return useQuery({
      queryKey: ["monthtlyExpenses", month],
      queryFn: () => getMonthlyExpenses(user!.uid, month),
    });
  };

  return {
    useMonthlyExpenseTrend,
  };
};

export default useEpxenseTrend;
