// react hooks
import { useAuth } from "../../context/AuthContext";

// tanstack
import { useMutation } from "@tanstack/react-query";

// types
import { createExpense, queryClient } from "../../api/expenses";
import ExpenseForm from "../../components/form/Expense";
import useExpenseForm from "../../hooks/useExpenseForm";

const AddExpense = () => {
  const {
    inputValues,
    handleInputChange,
    resetForm,
    showSubmitMessage,
    setInputValues,
    submitMessage,
    getExpenseDetail,
  } = useExpenseForm();

  const { user } = useAuth();

  const { mutate, isPending } = useMutation({
    mutationFn: createExpense,
    onSuccess: () => {
      showSubmitMessage("Expense added successfully");
      resetForm();
      queryClient.invalidateQueries({
        queryKey: ["users"],
        refetchType: "none",
      });
    },

    onError: () => {
      console.error("Unable to add expense");
      showSubmitMessage("Unable to add expense");
    },
  });

  const handleFormSubmit = (e: React.SubmitEvent) => {
    try {
      e.preventDefault();

      const expenseDetail = getExpenseDetail();

      if (expenseDetail.amount <= 0) {
        showSubmitMessage("Please enter amount");
        return;
      }

      if (!user?.uid) {
        return;
      }

      mutate({ uid: user.uid, expenseDetail });
    } catch (error) {
      console.error("Unable to add", error);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-medium mb-4">Add Expense</h1>
      <ExpenseForm
        handleFormSubmit={handleFormSubmit}
        handleInputChange={handleInputChange}
        inputValues={inputValues}
        isPending={isPending}
        submitMessage={submitMessage}
      />
    </>
  );
};

export default AddExpense;
