import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import useExpenses from "../../hooks/useExpenses";
import { useCategories } from "../../hooks/useCategories";
import { getCurrentMonth } from "../../utils/helpers";

export default function SpendingByCategory() {
  const currentMonth = getCurrentMonth();
  const { useGetExpenseMonthYear } = useExpenses();
  const { data: expenseData } = useGetExpenseMonthYear(currentMonth);

  const { useGetCategories } = useCategories();
  const { data: categories } = useGetCategories();

  const groupedExpenses = expenseData?.reduce<
    Record<
      string,
      {
        category: string;
        categoryColor: string;
        amount: number;
      }
    >
  >((acc, expense) => {
    const categoryData = categories?.find(
      (category) => category.id === expense.category,
    );

    const categoryName = categoryData?.name ?? "Other";
    const categoryColor = categoryData?.color ?? "#64748b";

    if (!acc[categoryName]) {
      acc[categoryName] = {
        category: categoryName,
        categoryColor,
        amount: 0,
      };
    }

    acc[categoryName].amount += expense.amount;

    return acc;
  }, {});

  const formattedExpense = Object.values(groupedExpenses ?? []);
  // console.log("formattedExpense", formattedExpense);

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const totalSpent =
    formattedExpense?.reduce((sum, item) => sum + item.amount, 0) || 0;

  const hoveredCategory =
    activeIndex !== null && formattedExpense
      ? formattedExpense[activeIndex]
      : null;

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;

    const item = payload[0].payload;

    const percentage = ((item.amount / totalSpent) * 100).toFixed(1);

    return (
      <div className="bg-white border rounded-xl px-3 py-2 shadow-md ">
        <div className="flex gap-5 items-center">
          <span>{item.category}</span>

          <span className="font-semibold">
            ₹{item.amount.toLocaleString("en-IN")}
          </span>
        </div>

        <div className="text-xs text-gray-500 mt-1">
          {percentage}% of total spending
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white border rounded-lg p-4 h-full">
      <h3 className="text-[.9rem] font-medium">Spending by Category</h3>

      <p className="text-gray-500 text-sm mb-4">June 2026</p>

      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={formattedExpense}
              dataKey="amount"
              nameKey="category"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={85}
              activeIndex={activeIndex ?? undefined}
              // activeOuterRadius={95}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {formattedExpense?.map((expense, index) => (
                <Cell key={index} fill={expense.categoryColor} />
              ))}
            </Pie>

            <Tooltip content={<CustomTooltip />} />

            {/* Center Amount */}
            <text
              x="50%"
              y="48%"
              textAnchor="middle"
              dominantBaseline="middle"
              style={{
                fontSize: "14px",
                fontWeight: 700,
              }}
            >
              ₹{(hoveredCategory?.amount ?? totalSpent).toLocaleString("en-IN")}
            </text>

            {/* Center Label */}
            <text
              x="50%"
              y="58%"
              textAnchor="middle"
              dominantBaseline="middle"
              style={{
                fontSize: "12px",
                fill: "#64748b",
              }}
            >
              {hoveredCategory?.category ?? "Total Spent"}
            </text>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-y-2 gap-x-4 mt-2">
        {formattedExpense?.map((item, index) => (
          <div
            key={item.category}
            className="flex items-center gap-2 text-[.8rem] text-gray-600"
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: item.categoryColor,
              }}
            />

            <span>{item.category}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
