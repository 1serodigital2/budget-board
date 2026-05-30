import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createBudget,
  deleteBudgetById,
  getBudgetById,
  getBudgetMonthYear,
  getBudgets,
  updateBudget,
} from "../api/budget";
import useSubmitMessage from "./useSubmitMessage";
import { queryClient } from "../services/firebase";
import { useAuth } from "../context/AuthContext";
import { BudgetInputType, UpdateBudgetType } from "../types/budget";

const initialValues: BudgetInputType = {
  category: "",
  amount: 0,
  month: "",
};

const useBudget = () => {
  const [inputValue, setInputValue] = useState<BudgetInputType>(initialValues);
  const { submitMessage, showSubmitMessage } = useSubmitMessage();
  const { user } = useAuth();

  const useAddBudgetForm = () => {
    return useMutation({
      mutationFn: createBudget,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["budget"],
        });
        showSubmitMessage("budget added successfully", "success");
        setInputValue(initialValues);
      },
      onError: () => {
        showSubmitMessage("Error adding budget", "error");
      },
    });
  };

  const getAllBudgets = () => {
    return useQuery({
      queryKey: ["budgets"],
      queryFn: () => getBudgets(user?.uid!),
      enabled: !!user?.uid,
    });
  };

  const getBudget = (budgetId: string) => {
    return useQuery({
      queryKey: ["budgets", budgetId],
      queryFn: () => getBudgetById({ uid: user?.uid!, budgetId }),
      enabled: !!budgetId && !!user?.uid,
    });
  };

  const useDeleteBudget = () => {
    return useMutation({
      mutationFn: (budgetId: string) =>
        deleteBudgetById({ uid: user?.uid!, budgetId }),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["budgets"],
        });
        showSubmitMessage("Budget deleted successfully", "success");
      },
      onError: () => {
        showSubmitMessage("Budget unable to delete", "error");
      },
    });
  };

  const useBudgetUpdate = (budgetId: string) => {
    return useMutation({
      mutationFn: (budgetDetail: BudgetInputType) =>
        updateBudget({ uid: user?.uid!, budgetId, budgetDetail }),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["budgets", budgetId],
        });
        showSubmitMessage("Budget updated successfully", "success");
      },
      onError: () => {
        showSubmitMessage("Unable to update error", "error");
      },
    });
  };

  const useBudgetMonthYear = (monthYear: string) => {
    return useQuery({
      queryKey: ["budgets", monthYear],
      queryFn: () =>
        getBudgetMonthYear({
          monthYear,
          uid: user!.uid,
        }),
      enabled: !!user?.uid,
    });
  };

  return {
    useAddBudgetForm,
    submitMessage,
    inputValue,
    setInputValue,
    showSubmitMessage,
    getAllBudgets,
    getBudget,
    useDeleteBudget,
    useBudgetUpdate,
    useBudgetMonthYear
  };
};
export default useBudget;
