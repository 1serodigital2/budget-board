import { useNavigate, useParams } from "react-router-dom";
import BudgetForm from "../../components/budgets/BudgetForm";
import Card from "../../components/ui/Card";
import PageHeader from "../../components/ui/PageHeader";
import { PageLoader } from "../../components/ui/Spinner";
import { ErrorState } from "../../components/ui/States";
import { useToast } from "../../context/ToastContext";
import { useBudget, useUpdateBudget } from "../../hooks/useBudgets";
import { getErrorMessage } from "../../utils/helpers";

const EditBudgetPage = () => {
  const id = Number(useParams().id);
  const navigate = useNavigate();
  const toast = useToast();
  const { data: budget, isPending, isError, error, refetch } = useBudget(id);
  const updateBudget = useUpdateBudget(id);

  if (isPending) return <PageLoader label="Loading budget…" />;
  if (isError) {
    return (
      <>
        <PageHeader back={{ to: "/budgets", label: "Budgets" }} title="Edit budget" />
        <Card>
          <ErrorState error={error} onRetry={() => refetch()} />
        </Card>
      </>
    );
  }

  const backTo = `/budgets?month=${budget.month}`;

  return (
    <>
      <PageHeader
        back={{ to: backTo, label: "Budgets" }}
        title="Edit budget"
        description="Change the limit, category or month."
      />
      <BudgetForm
        key={budget.id}
        budgetId={budget.id}
        initialValues={budget}
        submitLabel="Save changes"
        submitting={updateBudget.isPending}
        cancelTo={backTo}
        onSubmit={async (input) => {
          try {
            await updateBudget.mutateAsync(input);
          } catch (err) {
            toast.error(getErrorMessage(err, "Unable to update budget"));
            throw err;
          }
          toast.success("Budget updated");
          navigate(`/budgets?month=${input.month}`);
        }}
      />
    </>
  );
};

export default EditBudgetPage;
