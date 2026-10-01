import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import {
  copyBudgets,
  createBudget,
  deleteBudget,
  getBudgetById,
  getBudgetsForMonth,
  updateBudget,
} from "../api/budget";
import { useUserId } from "../context/AuthContext";
import { queryClient } from "../services/supabase";
import { queryKeys } from "../services/queryKeys";
import type { BudgetInput } from "../types/budget";

const invalidateBudgets = () =>
  Promise.all([
    queryClient.invalidateQueries({ queryKey: ["budgets"] }),
    queryClient.invalidateQueries({ queryKey: ["trend"] }),
  ]);

/** Budgets for a "YYYY-MM" month. */
export const useMonthBudgets = (month: string) => {
  const uid = useUserId();
  return useQuery({
    queryKey: queryKeys.budgetsForMonth(uid, month),
    queryFn: () => getBudgetsForMonth(uid, month),
    placeholderData: keepPreviousData,
  });
};

export const useBudget = (id: number) => {
  const uid = useUserId();
  return useQuery({
    queryKey: queryKeys.budget(uid, id),
    queryFn: () => getBudgetById(uid, id),
    enabled: Number.isFinite(id) && id > 0,
  });
};

export const useCreateBudget = () => {
  const uid = useUserId();
  return useMutation({
    mutationFn: (input: BudgetInput) => createBudget(uid, input),
    onSuccess: invalidateBudgets,
  });
};

export const useUpdateBudget = (id: number) => {
  const uid = useUserId();
  return useMutation({
    mutationFn: (input: BudgetInput) => updateBudget(uid, id, input),
    onSuccess: invalidateBudgets,
  });
};

export const useDeleteBudget = () => {
  const uid = useUserId();
  return useMutation({
    mutationFn: (id: number) => deleteBudget(uid, id),
    onSuccess: invalidateBudgets,
  });
};

export const useCopyBudgets = () => {
  const uid = useUserId();
  return useMutation({
    mutationFn: ({ from, to }: { from: string; to: string }) =>
      copyBudgets(uid, from, to),
    onSuccess: invalidateBudgets,
  });
};
