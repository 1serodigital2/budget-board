import { useMutation } from "@tanstack/react-query";
import { createBudget } from "../api/budget";
import useSubmitMessage from "./useSubmitMessage";

const useBudget = () => {
  const { submitMessage, showSubmitMessage } = useSubmitMessage();

  const submitBudgetForm = () => {
    return useMutation({
      mutationFn: createBudget,
      onSuccess: () => {
        showSubmitMessage("budget added successfully", "success");
      },
      onError: () => {
        showSubmitMessage("Error adding budget", "error");
      },
    });
  };

  return {
    submitBudgetForm,
    submitMessage,
  };
};
export default useBudget;
