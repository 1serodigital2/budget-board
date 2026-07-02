import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../../api/category";
import { useAuth } from "../../context/AuthContext";
import { getCurrentMonth, moneyFormat } from "../../utils/helpers";
import useBudgetVsCategory from "../../hooks/useBudgetVsCategory";
import useBudget from "../../hooks/useBudget";
import { GetExpenseDetailsType } from "../../types/expense";

const CategoryBudgetProgress = ({
  expenses,
}: {
  expenses: GetExpenseDetailsType[];
}) => {
  const { user } = useAuth();
  const month = getCurrentMonth();

  const {
    data: categories,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(user!.id),
    enabled: !!user!.id,
  });

  const { useGetBudgetMonthYear } = useBudget();
  const { data: currentMonthBudgets } = useGetBudgetMonthYear(month);

  const monthlyCategorySpent = useBudgetVsCategory({
    month,
    budgets: currentMonthBudgets || [],
    expenses,
    categories: categories || [],
  });

  return (
    <div className="grid grid-cols-5 gap-5">
      {monthlyCategorySpent.map((item) => {
        const percentage = (item.spent / item.budget) * 100 || 0;

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
              <span>
                Budget: {item.budget > 0 ? moneyFormat(item.budget) : 0}
              </span>
              <span>Spent: {item.spent > 0 ? moneyFormat(item.spent) : 0}</span>
            </div>

            <div className="mt-1 text-sm">
              {percentage > 100 ? (
                <span className="text-red-600">
                  Over by ₹
                  {item.spent > 0
                    ? (item.spent - item.budget).toLocaleString()
                    : 0}
                </span>
              ) : (
                <span className="text-green-600">
                  Remaining ₹
                  {item.spent > 0
                    ? (item.budget - item.spent).toLocaleString()
                    : 0}
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
