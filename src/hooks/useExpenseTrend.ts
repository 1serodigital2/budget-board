import { useQuery } from "@tanstack/react-query";
import { getMonthlyExpenses } from "../api/expenses";
import { useAuth } from "../context/AuthContext";

const useEpxenseTrend = () => {
  const { user } = useAuth();

  const useMonthlyExpenseTrend = () => {
    return useQuery({
      queryKey: ["monthtlyExpenses"],
      queryFn: () => getMonthlyExpenses(user!.uid),
    });
  };

  return {
    useMonthlyExpenseTrend,
  };
};

export default useEpxenseTrend;
