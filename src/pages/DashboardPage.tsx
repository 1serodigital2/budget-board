import CategoryBudgetProgress from "../components/dashbaord/CategoryBudgetProgress";
import DailyExpenseChart from "../components/dashbaord/DailyExpenseChart";
import Alert from "../components/ui/Alert";
import H1 from "../components/ui/Heading";
import useBudget from "../hooks/useBudget";
import useBudgetSummary from "../hooks/useBudgetSummary";
import useExpenses from "../hooks/useExpenses";
import useEpxenseTrend from "../hooks/useExpenseTrend";
import { getMonthYear, moneyFormat } from "../utils/helpers";

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

  const { useMonthlyExpenseTrend } = useEpxenseTrend();
  const { data: monthlyExpenses } = useMonthlyExpenseTrend();

  console.log("Monthly expenses", expenses);

  if (isLoading) {
    return <Alert message="Loading data" />;
  }

  const todaysMonth =
    new Date().toLocaleString("en-US", {
      month: "short",
    }) +
    ", " +
    new Date().getFullYear();

  return (
    <>
      <H1>Budget Summary for {todaysMonth}</H1>
      <div className="grid grid-cols-4 gap-5 mb-5">
        <div className="border p-6 rounded-lg">
          <h5 className="mb-3">Total Budget</h5>
          <div className="text-4xl font-medium">{moneyFormat(totalBudget)}</div>
        </div>
        <div className="border p-6 rounded-lg">
          <h5 className="mb-3">Total Expenses</h5>
          <div className="text-4xl font-medium">
            {moneyFormat(totalExpenses)}
          </div>
        </div>
        <div className="border p-6 rounded-lg">
          <h5 className="mb-3">Remaining Budget</h5>
          <div
            className={`text-4xl font-medium ${remainingBudget < 0 ? "text-red-800" : "text-green-700"}`}
          >
            {moneyFormat(remainingBudget)}
          </div>
        </div>
        <div className="border p-6 rounded-lg">
          <h5 className="mb-3">Expense Rate</h5>
          <div className="text-4xl font-medium">{budgetPercentageSpent} %</div>
        </div>
      </div>
      <CategoryBudgetProgress expenses={expenses || []} />
      <div className="grid grid-cols-2 mt-6">
        <DailyExpenseChart data={monthlyExpenses || []} />
      </div>
    </>
  );
};

export default Dashboard;
