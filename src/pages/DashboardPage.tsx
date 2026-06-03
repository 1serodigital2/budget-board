import H1 from "../components/ui/Heading";
import { useAuth } from "../context/AuthContext";
import useBudget from "../hooks/useBudget";
import useBudgetSummary from "../hooks/useBudgetSummary";
import useExpenses from "../hooks/useExpenses";
import { getMonthYear } from "../utils/helpers";

const date = getMonthYear();
const Dashboard = () => {
  const { user } = useAuth();

  const { useGetBudgetMonthYear } = useBudget();
  const { data: budgets } = useGetBudgetMonthYear(date);

  const { useGetExpenseMonthYear } = useExpenses();
  const { data: expenses } = useGetExpenseMonthYear(date);

  const { getTotalExpenses } = useBudgetSummary();
  const totalExpenses = getTotalExpenses({ expenses: expenses });

  console.log("budgets", budgets);
  console.log("expenses", expenses);
  console.log("totalExpenses", totalExpenses);

  return (
    <>
      <H1>Budget Summary</H1>
      <div className="grid grid-cols-4 gap-5">
        <div className="border p-6 rounded-2xl">
          <h5 className="mb-3">Total Budget</h5>
          <div className="text-4xl font-medium">₹ 40000</div>
        </div>
        <div className="border p-6 rounded-2xl">
          <h5 className="mb-3">Total Expenses</h5>
          <div className="text-4xl font-medium">₹ 40000</div>
        </div>
        <div className="border p-6 rounded-2xl">
          <h5 className="mb-3">Remaining Budget</h5>
          <div className="text-4xl font-medium">₹ 40000</div>
        </div>
        <div className="border p-6 rounded-2xl">
          <h5 className="mb-3">Savings Rate</h5>
          <div className="text-4xl font-medium">₹ 40000</div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
