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

  // Override specific colors to match the design visually if they are basic colors
  const designColors = ["#10b981", "#fca5a5", "#fbbf24", "#60a5fa", "#a78bfa", "#f472b6"];

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

  const formattedExpense = Object.values(groupedExpenses ?? []).map((item, i) => ({
    ...item,
    // Assign from our design palette if we have enough colors to make it look premium
    categoryColor: designColors[i % designColors.length]
  })).sort((a, b) => b.amount - a.amount); // sort by amount

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
      <div className="bg-card border border-border/60 rounded-xl px-4 py-3 shadow-lg">
        <div className="flex gap-4 items-center mb-1">
          <span className="text-sm font-semibold text-muted-foreground">{item.category}</span>
          <span className="text-sm font-bold text-foreground">
            ?{item.amount.toLocaleString("en-IN")}
          </span>
        </div>
        <div className="text-xs text-muted-foreground font-medium">
          {percentage}% of total spending
        </div>
      </div>
    );
  };

  const currentMonthLabel = new Date().toLocaleString("default", { month: "long", year: "numeric" });

  return (
    <div className="h-full flex flex-col w-full">
      <div className="flex justify-between items-start mb-1">
        <div>
          <h3 className="text-[18px] font-bold text-foreground tracking-tight">Spending by Category</h3>
          <p className="text-muted-foreground text-[12px] mt-1">Month of {currentMonthLabel} • ?{totalSpent.toLocaleString("en-IN")}</p>
        </div>
        <button className="text-muted-foreground hover:text-foreground cursor-pointer">
          <span className="material-symbols-outlined">more_horiz</span>
        </button>
      </div>

      <div className="flex-1 min-h-[200px] mt-4 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={formattedExpense}
              dataKey="amount"
              nameKey="category"
              cx="50%"
              cy="50%"
              innerRadius={75}
              outerRadius={95}
              activeIndex={activeIndex ?? undefined}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              stroke="#1c1d24"
              strokeWidth={3}
              paddingAngle={2}
              cornerRadius={4}
            >
              {formattedExpense?.map((expense, index) => (
                <Cell key={index} fill={expense.categoryColor} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Absolute positioned center text to avoid recharts text clipping issues */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[20px] font-bold text-foreground tracking-tight">
            ?{(hoveredCategory?.amount ?? totalSpent).toLocaleString("en-IN")}
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            <span className="text-[9px] font-bold text-muted-foreground tracking-widest uppercase">
              {hoveredCategory?.category ?? "Active Cycle"}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-y-3 gap-x-6 mt-6 px-2">
        {formattedExpense?.map((item) => {
           const percentage = ((item.amount / totalSpent) * 100).toFixed(1);
           return (
            <div
              key={item.category}
              className="flex items-center justify-between text-[11px] font-medium"
            >
              <div className="flex items-center gap-2.5 truncate">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: item.categoryColor }}
                />
                <span className="text-foreground truncate">{item.category}</span>
              </div>
              <span className="text-muted-foreground font-semibold">{percentage}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
