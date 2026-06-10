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
import {
  BudgetInputType,
  BudgetTableTypes,
  UpdateBudgetType,
} from "../types/budget";

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

  const useGetBudgetMonthYear = (monthYear: string) => {
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

  const useGetBudgetTable = ({
    budgets,
    expenses,
    categories,
  }: BudgetTableTypes) => {
    if (!budgets || !expenses || !categories) return;

    let totalSpent = 0;
    let totalBudgetAmount = 0;
    let totalRemaining = 0;
    const budgetData = budgets.map((budget) => {
      const category = categories.find((cat) => cat.id === budget.category);

      const [yearStr, monthStr] = budget.month.split("-");
      const year = parseInt(yearStr, 10);
      const month = parseInt(monthStr, 10) - 1;
      const budgetStartDate = new Date(year, month, 1);
      const budgetEndDate = new Date(year, month + 1, 1);

      const spent = expenses
        .filter(
          (expense) =>
            expense.category === budget.category &&
            expense.date >= budgetStartDate &&
            expense.date <= budgetEndDate,
        )
        .reduce((total, expense) => total + expense.amount, 0);

      totalSpent += spent;

      const remaining = budget.amount - spent;
      totalRemaining += remaining;

      const percentage =
        budget.amount > 0
          ? Number(((spent / budget.amount) * 100).toFixed(2))
          : 0;

      const formattedMonth = new Date(
        Number(year),
        Number(month),
      ).toLocaleString("en-IN", {
        month: "long",
        year: "numeric",
      });

      totalBudgetAmount += Number(budget.amount);
      return {
        categoryName: category?.name ?? "Unknown",
        categoryId: category?.id,
        categorySlug: category?.slug,
        budget: budget.amount || 0,
        spent: spent || 0,
        remaining: remaining || 0,
        percentage: percentage || 0,
        budgetMonth: formattedMonth || "N/A",
      };
    });

    return {
      totalBudgetAmount,
      totalSpent,
      totalRemaining,
      budgetData,
    };
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
    useGetBudgetMonthYear,
    useGetBudgetTable,
  };
};
export default useBudget;
