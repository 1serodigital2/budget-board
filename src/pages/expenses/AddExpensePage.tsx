// react hooks
import { useAuth } from "../../context/AuthContext";

// tanstack
import { useMutation } from "@tanstack/react-query";

// types
import { createExpense } from "../../api/expenses";
import { queryClient } from "../../services/supabase";
import ExpenseForm from "../../components/form/Expense";
import useExpenseForm from "../../hooks/useExpenseForm";
import H1 from "../../components/ui/Heading";

const AddExpense = () => {
  const {
    inputValues,
    handleInputChange,
    resetForm,
    showSubmitMessage,
    submitMessage,
    getExpenseDetail,
  } = useExpenseForm();

  const { user } = useAuth();

  const { mutate, isPending } = useMutation({
    mutationFn: createExpense,
    onSuccess: () => {
      showSubmitMessage("Expense added successfully", "success");
      resetForm();
      queryClient.invalidateQueries({
        queryKey: ["users"],
        refetchType: "none",
      });
    },

    onError: (error) => {
      console.error("Unable to add expense", error);
      showSubmitMessage("Unable to add expense", "error");
    },
  });

  const handleFormSubmit = (e: React.SyntheticEvent) => {
    try {
      e.preventDefault();

      const expenseDetail = getExpenseDetail();

      if (expenseDetail.amount <= 0) {
        showSubmitMessage("Please enter amount");
        return;
      }

      if (!user?.id) {
        return;
      }

      const formattedExpenseDetail = {
        ...expenseDetail,
        date: new Date(expenseDetail.date).toISOString(),
        category: Number(expenseDetail.category),
      };

      mutate({ expenseDetail: formattedExpenseDetail, uid: user.id });
    } catch (error) {
      console.error("Unable to add", error);
    }
  };

  return (
    <>
      <H1>Add Expense</H1>
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
