import { useNavigate } from "react-router-dom";
import ExpenseForm from "../../components/expenses/ExpenseForm";
import PageHeader from "../../components/ui/PageHeader";
import { useToast } from "../../context/ToastContext";
import { useCreateExpense } from "../../hooks/useExpenses";
import { getErrorMessage } from "../../utils/helpers";

const AddExpensePage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const createExpense = useCreateExpense();

  return (
    <>
      <PageHeader
        back={{ to: "/expenses", label: "Expenses" }}
        title="Add expense"
        description="Record money you've spent."
      />
      <ExpenseForm
        submitLabel="Save expense"
        submitting={createExpense.isPending}
        cancelTo="/expenses"
        allowAddAnother
        onSubmit={async (input, { addAnother }) => {
          try {
            await createExpense.mutateAsync(input);
          } catch (error) {
            toast.error(getErrorMessage(error, "Unable to add expense"));
            throw error;
          }
          toast.success("Expense added");
          if (!addAnother) navigate("/expenses");
        }}
      />
    </>
  );
};

export default AddExpensePage;
