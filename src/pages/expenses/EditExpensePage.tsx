import { useNavigate, useParams } from "react-router-dom";
import ExpenseForm from "../../components/expenses/ExpenseForm";
import PageHeader from "../../components/ui/PageHeader";
import { PageLoader } from "../../components/ui/Spinner";
import { ErrorState } from "../../components/ui/States";
import { useToast } from "../../context/ToastContext";
import { useExpense, useUpdateExpense } from "../../hooks/useExpenses";
import { getErrorMessage } from "../../utils/helpers";

const EditExpensePage = () => {
  const id = Number(useParams().id);
  const navigate = useNavigate();
  const toast = useToast();
  const { data: expense, isPending, isError, error, refetch } = useExpense(id);
  const updateExpense = useUpdateExpense(id);

  const back = { to: `/expenses/${id}`, label: "Expense details" };

  if (isPending) return <PageLoader label="Loading expense…" />;
  if (isError) {
    return (
      <>
        <PageHeader back={{ to: "/expenses", label: "Expenses" }} title="Edit expense" />
        <ErrorState error={error} onRetry={() => refetch()} />
      </>
    );
  }

  return (
    <>
      <PageHeader back={back} title="Edit expense" description="Update the details of this expense." />
      <ExpenseForm
        key={expense.id}
        initialValues={expense}
        submitLabel="Save changes"
        submitting={updateExpense.isPending}
        cancelTo={back.to}
        onSubmit={async (input) => {
          try {
            await updateExpense.mutateAsync(input);
          } catch (err) {
            toast.error(getErrorMessage(err, "Unable to update expense"));
            throw err;
          }
          toast.success("Expense updated");
          navigate(back.to);
        }}
      />
    </>
  );
};

export default EditExpensePage;
