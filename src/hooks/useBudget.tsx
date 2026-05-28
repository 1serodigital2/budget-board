import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createBudget, getBudgetById, getBudgets } from "../api/budget";
import useSubmitMessage from "./useSubmitMessage";
import { queryClient } from "../services/firebase";
import { useAuth } from "../context/AuthContext";
import { BudgetInputType } from "../types/budget";

const initialValues = {
  category: "",
  amount: 0,
  month: "",
};

const useBudget = () => {
  const [inputValue, setInputValue] = useState<BudgetInputType>(initialValues);
  const { submitMessage, showSubmitMessage } = useSubmitMessage();
  const { user } = useAuth();

  const submitBudgetForm = () => {
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

  return {
    submitBudgetForm,
    submitMessage,
    inputValue,
    setInputValue,
    showSubmitMessage,
    getAllBudgets,
    getBudget,
  };
};
export default useBudget;
