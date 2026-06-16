import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../../api/category";
import { useAuth } from "../../context/AuthContext";
import { getMonthYear } from "../../utils/helpers";
import useBudgetVsCategory from "../../hooks/useBudgetVsCategory";
import useBudget from "../../hooks/useBudget";
import { GetExpenseDetailsType } from "../../types/expense";

const catgs = [
  {
    category: "Food",
    budget: 5000,
    spent: 6200,
  },
  {
    category: "Shopping",
    budget: 4000,
    spent: 2500,
  },
  {
    category: "Transport",
    budget: 3000,
    spent: 2100,
  },
  {
    category: "Bills",
    budget: 2000,
    spent: 1900,
  },
];
const CategoryBudgetProgress = ({
  expenses,
}: {
  expenses: GetExpenseDetailsType[];
}) => {
  const { user } = useAuth();
  const month = getMonthYear();

  const {
    data: categories,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(user!.uid),
    enabled: !!user!.uid,
  });

  const { useGetBudgetMonthYear } = useBudget();
  const { data: currentMonthBudgets } = useGetBudgetMonthYear(month);

  const monthlyCategorySpent = useBudgetVsCategory({
    month,
    budgets: currentMonthBudgets || [],
    expenses,
    categories: categories || [],
  });

  console.log("monthlyCategorySpent", monthlyCategorySpent);

  return (
    <div className="grid grid-cols-5 gap-5">
      {monthlyCategorySpent.map((item) => {
        const percentage = (item.spent / item.budget) * 100;

        const barColor =
          percentage > 100
            ? "bg-red-500"
            : percentage >= 80
              ? "bg-yellow-500"
              : "bg-green-500";

        return (
          <div key={item.category} className="rounded-lg border p-4 shadow-sm">
            <div className="flex justify-between mb-2">
              <h4 className="font-medium">{item.category}</h4>
              <span className="font-medium">{percentage.toFixed(0)}%</span>
            </div>

            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${barColor}`}
                style={{
                  width: `${Math.min(percentage, 100)}%`,
                }}
              />
            </div>

            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>Budget: ₹{item.budget.toLocaleString()}</span>
              <span>Spent: ₹{item.spent.toLocaleString()}</span>
            </div>

            <div className="mt-1 text-sm">
              {percentage > 100 ? (
                <span className="text-red-600">
                  Over by ₹{(item.spent - item.budget).toLocaleString()}
                </span>
              ) : (
                <span className="text-green-600">
                  Remaining ₹{(item.budget - item.spent).toLocaleString()}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CategoryBudgetProgress;
