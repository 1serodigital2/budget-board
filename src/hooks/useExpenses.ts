import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import {
  createExpense,
  deleteExpense,
  getExpenseById,
  getExpenses,
  getExpensesInRange,
  getMonthlyTrend,
  updateExpense,
} from "../api/expenses";
import { useUserId } from "../context/AuthContext";
import { queryClient } from "../services/supabase";
import { queryKeys } from "../services/queryKeys";
import type { ExpenseFilters, ExpenseInput } from "../types/expense";
import { monthBounds } from "../utils/helpers";

const invalidateExpenses = () =>
  Promise.all([
    queryClient.invalidateQueries({ queryKey: ["expenses"] }),
    queryClient.invalidateQueries({ queryKey: ["trend"] }),
  ]);

export const useExpenseList = (filters: ExpenseFilters) => {
  const uid = useUserId();
  return useInfiniteQuery({
    queryKey: queryKeys.expenseList(uid, filters),
    queryFn: ({ pageParam }) => getExpenses(uid, filters, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextOffset ?? undefined,
    placeholderData: keepPreviousData,
  });
};

/** All expenses in a "YYYY-MM" month. */
export const useMonthExpenses = (month: string) => {
  const uid = useUserId();
  const { start, endExclusive } = monthBounds(month);
  return useQuery({
    queryKey: queryKeys.expenseRange(uid, start, endExclusive),
    queryFn: () => getExpensesInRange(uid, start, endExclusive),
    placeholderData: keepPreviousData,
  });
};

export const useExpense = (id: number) => {
  const uid = useUserId();
  return useQuery({
    queryKey: queryKeys.expense(uid, id),
    queryFn: () => getExpenseById(uid, id),
    enabled: Number.isFinite(id) && id > 0,
  });
};

export const useMonthlyTrend = (months: number) => {
  const uid = useUserId();
  return useQuery({
    queryKey: queryKeys.trend(uid, months),
    queryFn: () => getMonthlyTrend(uid, months),
    placeholderData: keepPreviousData,
  });
};

export const useCreateExpense = () => {
  const uid = useUserId();
  return useMutation({
    mutationFn: (input: ExpenseInput) => createExpense(uid, input),
    onSuccess: invalidateExpenses,
  });
};

export const useUpdateExpense = (id: number) => {
  const uid = useUserId();
  return useMutation({
    mutationFn: (input: ExpenseInput) => updateExpense(uid, id, input),
    onSuccess: invalidateExpenses,
  });
};

export const useDeleteExpense = () => {
  const uid = useUserId();
  return useMutation({
    mutationFn: (id: number) => deleteExpense(uid, id),
    onSuccess: invalidateExpenses,
  });
};
