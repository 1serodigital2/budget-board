import { useQuery } from "@tanstack/react-query";
import { getMonthlyExpenses } from "../api/expenses";
import { useAuth } from "../context/AuthContext";

const useEpxenseTrend = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["monthtlyExpenses"],
    queryFn: () => getMonthlyExpenses(user!.uid),
  });
};

export default useEpxenseTrend;
