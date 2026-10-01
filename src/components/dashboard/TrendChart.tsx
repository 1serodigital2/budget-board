import { useState } from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipProps,
} from "recharts";
import { useMonthlyTrend } from "../../hooks/useExpenses";
import type { MonthlyTrendPoint } from "../../types/expense";
import { formatMoney, formatMonth } from "../../utils/helpers";
import Card, { CardHeader } from "../ui/Card";
import { ErrorState, Skeleton } from "../ui/States";
import { useChartTheme } from "./chartTheme";

type TrendPoint = MonthlyTrendPoint & { budgetLine: number | null; over: boolean };

const RANGES = [
  { months: 6, label: "6M" },
  { months: 12, label: "12M" },
];

const TrendTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload as MonthlyTrendPoint;
  const diff = point.budget - point.expense;
  return (
    <div className="min-w-48 rounded-xl border bg-card px-3.5 py-3 text-xs shadow-lg">
      <p className="mb-2 font-semibold text-foreground">{formatMonth(point.month)}</p>
      <div className="space-y-1">
        <p className="flex justify-between gap-6 text-muted-foreground">
          Spent <span className="tabular font-medium text-foreground">{formatMoney(point.expense, "whole")}</span>
        </p>
        <p className="flex justify-between gap-6 text-muted-foreground">
          Budget <span className="tabular font-medium text-foreground">{point.budget > 0 ? formatMoney(point.budget, "whole") : "—"}</span>
        </p>
      </div>
      {point.budget > 0 && (
        <p className={`mt-2 border-t pt-2 font-medium ${diff < 0 ? "text-destructive" : "text-success"}`}>
          {diff < 0 ? `${formatMoney(-diff, "whole")} over budget` : `${formatMoney(diff, "whole")} under budget`}
        </p>
      )}
    </div>
  );
};

const TrendChart = () => {
  const [months, setMonths] = useState(6);
  const colors = useChartTheme();
  const { data, isPending, isError, error, refetch } = useMonthlyTrend(months);

  const totals = (data ?? []).reduce(
    (acc, p) => ({ expense: acc.expense + p.expense, budget: acc.budget + p.budget }),
    { expense: 0, budget: 0 },
  );
  const average = data?.length ? totals.expense / data.length : 0;

  // Months without a budget are skipped (the line bridges over them) rather
  // than plotted at ₹0, which would look like a real budget of nothing.
  const chartData: TrendPoint[] = (data ?? []).map((point) => ({
    ...point,
    budgetLine: point.budget > 0 ? point.budget : null,
    over: point.budget > 0 && point.expense > point.budget,
  }));

  return (
    <Card className="flex h-full flex-col">
      <CardHeader
        title="Spending vs budget"
        description={
          data
            ? `${formatMoney(average, "whole")} average monthly spend over ${months} months`
            : `Last ${months} months`
        }
        action={
          <div className="inline-flex rounded-lg bg-muted p-0.5" role="group" aria-label="Range">
            {RANGES.map((range) => (
              <button
                key={range.months}
                type="button"
                aria-pressed={months === range.months}
                onClick={() => setMonths(range.months)}
                className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
                  months === range.months
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        }
      />
      <div className="flex items-center gap-5 px-5 pt-4 text-xs text-muted-foreground sm:px-6">
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-4 rounded-full" style={{ backgroundColor: colors.spend }} />
          Spent
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full" style={{ backgroundColor: colors.over }} />
          Over budget
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-0 w-4 border-t-2 border-dashed" style={{ borderColor: colors.budget }} />
          Budget
        </span>
      </div>
      <div className="min-h-72 flex-1 px-2 pt-2 pb-4 sm:px-4">
        {isPending ? (
          <Skeleton className="mx-3 h-full" />
        ) : isError ? (
          <ErrorState error={error} onRetry={() => refetch()} />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="spendFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colors.spend} stopOpacity={0.28} />
                  <stop offset="100%" stopColor={colors.spend} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke={colors.grid} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ fill: colors.axis, fontSize: 12 }}
                tickFormatter={(label: string) => label.split(" ")[0]}
                dy={6}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={56}
                tick={{ fill: colors.axis, fontSize: 12 }}
                tickFormatter={(value: number) => formatMoney(value, "compact")}
              />
              <Tooltip
                content={<TrendTooltip />}
                cursor={{ stroke: colors.grid, strokeWidth: 1.5 }}
              />
              <Line
                dataKey="budgetLine"
                name="Budget"
                type="monotone"
                stroke={colors.budget}
                strokeWidth={1.75}
                strokeDasharray="5 4"
                strokeOpacity={0.7}
                dot={false}
                activeDot={false}
                connectNulls
              />
              <Area
                dataKey="expense"
                name="Spent"
                type="monotone"
                stroke={colors.spend}
                strokeWidth={2.5}
                fill="url(#spendFill)"
                dot={(props: { cx?: number; cy?: number; payload?: TrendPoint; index?: number }) =>
                  props.payload?.over ? (
                    <circle
                      key={props.index}
                      cx={props.cx}
                      cy={props.cy}
                      r={4.5}
                      fill={colors.over}
                      stroke={colors.surface}
                      strokeWidth={2}
                    />
                  ) : (
                    <g key={props.index} />
                  )
                }
                activeDot={{ r: 5, fill: colors.spend, stroke: colors.surface, strokeWidth: 2 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};

export default TrendChart;
