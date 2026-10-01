import { useState } from "react";
import { Link } from "react-router-dom";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import type { Category } from "../../types/category";
import type { Expense } from "../../types/expense";
import { formatMoney, lastDayOfMonth } from "../../utils/helpers";
import { CategoryDot } from "../ui/Badges";
import Card, { CardHeader } from "../ui/Card";
import { EmptyState } from "../ui/States";
import { pickShades, useChartTheme } from "./chartTheme";

const MAX_SLICES = 6;

interface Slice {
  id: number | "other";
  name: string;
  amount: number;
}

/** Largest first; anything past MAX_SLICES is folded into one "more" slice. */
const buildSlices = (expenses: Expense[], categories: Category[]): Slice[] => {
  const byId = new Map(categories.map((c) => [c.id, c]));
  const totals = new Map<number, number>();
  for (const e of expenses) totals.set(e.categoryId, (totals.get(e.categoryId) ?? 0) + e.amount);

  const slices: Slice[] = [...totals.entries()]
    .map(([id, amount]) => ({ id, amount, name: byId.get(id)?.name ?? "Uncategorized" }))
    .sort((a, b) => b.amount - a.amount);

  if (slices.length <= MAX_SLICES) return slices;
  const rest = slices.slice(MAX_SLICES - 1);
  return [
    ...slices.slice(0, MAX_SLICES - 1),
    {
      id: "other",
      name: `${rest.length} more`,
      amount: rest.reduce((sum, s) => sum + s.amount, 0),
    },
  ];
};

interface CategoryDonutProps {
  expenses: Expense[];
  categories: Category[];
  month: string;
}

const CategoryDonut = ({ expenses, categories, month }: CategoryDonutProps) => {
  const colors = useChartTheme();
  const [active, setActive] = useState<number | null>(null);
  const ranked = buildSlices(expenses, categories);
  const shades = pickShades(
    colors.series,
    ranked.filter((s) => s.id !== "other").length,
  );
  const slices = ranked.map((slice, i) => ({
    ...slice,
    color: slice.id === "other" ? colors.other : shades[i],
  }));
  const total = slices.reduce((sum, s) => sum + s.amount, 0);
  const focused = active !== null ? slices[active] : null;

  return (
    <Card className="@container flex h-full flex-col">
      <CardHeader title="Where it went" description="Spending by category" />
      {slices.length === 0 ? (
        <EmptyState icon="donut_large" title="No spending yet" description="Expenses for this month will appear here." />
      ) : (
        // Legend sits beside the donut when there's room. It never grows past
        // MAX_SLICES rows, so the card height stays the same however many
        // categories there are.
        <div className="flex flex-1 flex-col items-center gap-5 p-5 sm:p-6 @sm:flex-row @sm:gap-6">
          <div className="relative size-44 shrink-0 @sm:size-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={slices}
                  dataKey="amount"
                  nameKey="name"
                  innerRadius="72%"
                  outerRadius="100%"
                  paddingAngle={slices.length > 1 ? 2 : 0}
                  cornerRadius={4}
                  stroke={colors.surface}
                  strokeWidth={2}
                  isAnimationActive={false}
                  onMouseEnter={(_, index) => setActive(index)}
                  onMouseLeave={() => setActive(null)}
                >
                  {slices.map((slice, index) => (
                    <Cell
                      key={slice.id}
                      fill={slice.color}
                      opacity={active === null || active === index ? 1 : 0.35}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="max-w-28 truncate text-xs text-muted-foreground">
                {focused ? focused.name : "Total spent"}
              </span>
              <span className="tabular text-lg font-semibold tracking-tight">
                {formatMoney(focused ? focused.amount : total, "whole")}
              </span>
              {focused && (
                <span className="text-xs text-muted-foreground">
                  {Math.round((focused.amount / total) * 100)}%
                </span>
              )}
            </div>
          </div>
          <ul className="w-full min-w-0 space-y-0.5 @sm:flex-1">
            {slices.map((slice, index) => {
              const content = (
                <>
                  <CategoryDot color={slice.color} />
                  <span className="min-w-0 flex-1 truncate text-foreground">{slice.name}</span>
                  <span className="tabular text-muted-foreground">
                    {Math.round((slice.amount / total) * 100)}%
                  </span>
                  <span className="tabular w-20 text-right font-medium text-foreground">
                    {formatMoney(slice.amount, "whole")}
                  </span>
                </>
              );
              const className = `flex items-center gap-2 rounded-lg px-2 py-1.5 text-[13px] transition-colors ${
                active === index ? "bg-muted" : "hover:bg-muted"
              }`;
              return (
                <li
                  key={slice.id}
                  onMouseEnter={() => setActive(index)}
                  onMouseLeave={() => setActive(null)}
                >
                  {slice.id === "other" ? (
                    <div className={className}>{content}</div>
                  ) : (
                    <Link
                      to={`/expenses?category=${slice.id}&from=${month}-01&to=${lastDayOfMonth(month)}`}
                      className={className}
                    >
                      {content}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </Card>
  );
};

export default CategoryDonut;
