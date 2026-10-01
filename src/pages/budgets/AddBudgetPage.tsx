import { useNavigate, useSearchParams } from "react-router-dom";
import BudgetForm from "../../components/budgets/BudgetForm";
import PageHeader from "../../components/ui/PageHeader";
import { useToast } from "../../context/ToastContext";
import { useCreateBudget } from "../../hooks/useBudgets";
import { currentMonthKey, getErrorMessage, isMonthKey } from "../../utils/helpers";

const AddBudgetPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();
  const createBudget = useCreateBudget();

  const monthParam = params.get("month")?.slice(0, 7);
  const month = isMonthKey(monthParam) ? monthParam : currentMonthKey();
  const categoryId = Number(params.get("category")) || undefined;

  return (
    <>
      <PageHeader
        back={{ to: `/budgets?month=${month}`, label: "Budgets" }}
        title="New budget"
        description="Set a monthly spending limit for a category."
      />
      <BudgetForm
        initialValues={{ month, categoryId }}
        submitLabel="Create budget"
        submitting={createBudget.isPending}
        cancelTo={`/budgets?month=${month}`}
        onSubmit={async (input) => {
          try {
            await createBudget.mutateAsync(input);
          } catch (error) {
            toast.error(getErrorMessage(error, "Unable to create budget"));
            throw error;
          }
          toast.success("Budget created");
          navigate(`/budgets?month=${input.month}`);
        }}
      />
    </>
  );
};

export default AddBudgetPage;
