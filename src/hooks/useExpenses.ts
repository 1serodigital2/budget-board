import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getExpenses, getExpensesMonthYear } from "../api/expenses";
import { useAuth } from "../context/AuthContext";
import { DateRange, ExpensesResponse } from "../types/expense";

const useExpenses = () => {
  const { user } = useAuth();
  const useGetExpenseMonthYear = (monthYear: string) => {
    return useQuery({
      queryKey: ["expenses", monthYear],
      queryFn: () => getExpensesMonthYear({ uid: user!.id, monthYear }),
    });
  };

  const useGetExpensesQuery = ({
    category,
    dateRange,
  }: {
    category?: number;
    dateRange?: DateRange;
  }) => {
    return useInfiniteQuery<ExpensesResponse>({
      queryKey: [
        "expenses",
        user?.id,
        category,
        dateRange?.start || null,
        dateRange?.end || null,
      ],
      queryFn: ({ pageParam }) =>
        getExpenses(
          user!.id,
          category,
          dateRange,
          pageParam as number | undefined,
        ),
      initialPageParam: null,
      getNextPageParam: (lastPage) =>
        lastPage.hasMore ? lastPage.lastVisible : undefined,
      enabled: !!user?.id,
    });
  };
  return {
    useGetExpenseMonthYear,
    useGetExpensesQuery,
  };
};

export default useExpenses;
