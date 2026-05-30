import Alert from "../../components/ui/Alert";
import H1 from "../../components/ui/Heading";
import useBudget from "../../hooks/useBudget";
import { useCategories } from "../../hooks/useCategories";
import useExpenses from "../../hooks/useExpenses";
import { getMonthYear } from "../../utils/helpers";

const BudgetOverview = () => {
  const { useBudgetMonthYear } = useBudget();

  const currentMntYr = getMonthYear();

  const { data: budgets } = useBudgetMonthYear(currentMntYr);

  const { useGetCategoryMonthYear } = useCategories();
  const { data: categories } = useGetCategoryMonthYear();

  const { useGetExpenseMonthYear } = useExpenses();
  const {
    data: expenses,
    isError: expensesIsError,
    error: expensesError,
  } = useGetExpenseMonthYear(currentMntYr);

  console.log("budgets", budgets);
  console.log("categories", categories);
  console.log("expenses", expenses);

  return (
    <>
      <H1>Budget overview</H1>
      {expensesIsError && (
        <Alert
          type="error"
          message={expensesError.message || "Unablet to fetche expenses"}
        />
      )}
    </>
  );
};

export default BudgetOverview;
