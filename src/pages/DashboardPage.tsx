import DailyExpenseChart from "../components/dashbaord/DailyExpenseChart";
import Alert from "../components/ui/Alert";
import H1 from "../components/ui/Heading";
import useBudget from "../hooks/useBudget";
import useBudgetSummary from "../hooks/useBudgetSummary";
import useExpenses from "../hooks/useExpenses";
import useEpxenseTrend from "../hooks/useExpenseTrend";
import { getMonthYear } from "../utils/helpers";

const date = getMonthYear();
const Dashboard = () => {
  const { useGetBudgetMonthYear } = useBudget();
  const { data: budgets } = useGetBudgetMonthYear(date);

  const { useGetExpenseMonthYear } = useExpenses();
  const { data: expenses, isLoading } = useGetExpenseMonthYear(date);

  const { totalExpenses, totalBudget, remainingBudget, budgetPercentageSpent } =
    useBudgetSummary({
      budgets,
      expenses,
    });

  const { data: monthlyExpenses } = useEpxenseTrend();

  console.log("Monthly expenses", monthlyExpenses);

  if (isLoading) {
    return <Alert message="Loading data" />;
  }

  return (
    <>
      <H1>Budget Summary</H1>
      <div className="grid grid-cols-4 gap-5">
        <div className="border p-6 rounded-2xl">
          <h5 className="mb-3">Total Budget</h5>
          <div className="text-4xl font-medium">₹ {totalBudget}</div>
        </div>
        <div className="border p-6 rounded-2xl">
          <h5 className="mb-3">Total Expenses</h5>
          <div className="text-4xl font-medium">₹ {totalExpenses}</div>
        </div>
        <div className="border p-6 rounded-2xl">
          <h5 className="mb-3">Remaining Budget</h5>
          <div className="text-4xl font-medium">₹ {remainingBudget}</div>
        </div>
        <div className="border p-6 rounded-2xl">
          <h5 className="mb-3">Expense Rate</h5>
          <div className="text-4xl font-medium">{budgetPercentageSpent} %</div>
        </div>
      </div>
      <DailyExpenseChart data={monthlyExpenses || []} />
    </>
  );
};

export default Dashboard;
