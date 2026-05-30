import { useQuery } from "@tanstack/react-query";
import { getBudgetMonthYear } from "../api/budget";
import { useAuth } from "../context/AuthContext";

export const useGetBudgetMonthYear = (monthYear: string) => {
  const { user } = useAuth();
};
