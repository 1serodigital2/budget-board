import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createBudget } from "../api/budget";
import useSubmitMessage from "./useSubmitMessage";
import { queryClient } from "../services/firebase";

const initialValues = {
  category: "",
  amount: 0,
  month: "",
};

const useBudget = () => {
  const [inputValue, setInputValue] = useState(initialValues);
  const { submitMessage, showSubmitMessage } = useSubmitMessage();

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

  return {
    submitBudgetForm,
    submitMessage,
    inputValue,
    setInputValue,
    showSubmitMessage,
  };
};
export default useBudget;
