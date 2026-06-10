import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getExpenses, getExpensesMonthYear } from "../api/expenses";
import { useAuth } from "../context/AuthContext";
import { DateRange, ExpensesResponse } from "../types/expense";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

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
    return useInfiniteQuery<ExpensesResponse>({
      queryKey: [
        "expenses",
        user?.uid,
        category,
        dateRange?.start || null,
        dateRange?.end || null,
      ],
      queryFn: ({ pageParam }) =>
        getExpenses(
          user!.uid,
          category,
          dateRange,
          pageParam as QueryDocumentSnapshot<DocumentData> | null,
        ),
      initialPageParam: null,
      getNextPageParam: (lastPage) =>
        lastPage.hasMore ? lastPage.lastVisible : undefined,
      enabled: !!user?.uid,
    });
  };
  return {
    useGetExpenseMonthYear,
    useGetExpensesQuery,
  };
};

export default useExpenses;
