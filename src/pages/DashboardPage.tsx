import { useSearchParams } from "react-router-dom";
import { BudgetLines } from "../components/budgets/BudgetLines";
import CategoryDonut from "../components/dashboard/CategoryDonut";
import StatCard from "../components/dashboard/StatCard";
import TrendChart from "../components/dashboard/TrendChart";
import ExpenseList from "../components/expenses/ExpenseList";
import { ButtonLink } from "../components/ui/Button";
import Card, { CardHeader } from "../components/ui/Card";
import MonthSwitcher from "../components/ui/MonthSwitcher";
import PageHeader from "../components/ui/PageHeader";
import { Alert, EmptyState, Skeleton } from "../components/ui/States";
import { useAuth } from "../context/AuthContext";
import { useMonthBudgets } from "../hooks/useBudgets";
import { useCategories } from "../hooks/useCategories";
import { useMonthExpenses } from "../hooks/useExpenses";
import { buildBudgetSummary } from "../utils/budgetSummary";
import {
  currentMonthKey,
  daysInMonth,
  formatMoney,
  formatMonth,
  isMonthKey,
  lastDayOfMonth,
  shiftMonth,
} from "../utils/helpers";

const greeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

const DashboardPage = () => {
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();
  const thisMonth = currentMonthKey();
  const monthParam = params.get("month")?.slice(0, 7);
  const month = isMonthKey(monthParam) && monthParam <= thisMonth ? monthParam : thisMonth;
  const isCurrent = month === thisMonth;

  const expensesQuery = useMonthExpenses(month);
  const previousQuery = useMonthExpenses(shiftMonth(month, -1));
  const budgetsQuery = useMonthBudgets(month);
  const { data: categories = [] } = useCategories();

  const loading = expensesQuery.isPending || budgetsQuery.isPending;
  const expenses = expensesQuery.data ?? [];
  const summary = buildBudgetSummary(budgetsQuery.data ?? [], expenses, categories);
  const previousSpent = (previousQuery.data ?? []).reduce((sum, e) => sum + e.amount, 0);

  // Time-based figures
  const totalDays = daysInMonth(month);
  const elapsedDays = isCurrent ? new Date().getDate() : totalDays;
  const daysLeft = totalDays - elapsedDays + 1; // including today
  const dailyAverage = elapsedDays > 0 ? summary.totalSpent / elapsedDays : 0;
  const projected = dailyAverage * totalDays;
  const change =
    previousSpent > 0 ? ((summary.totalSpent - previousSpent) / previousSpent) * 100 : null;

  const overLines = summary.lines.filter((l) => l.status === "over");
  const hasBudget = summary.totalBudget > 0;
  const overall = summary.remaining < 0;
  const name = user?.email?.split("@")[0] ?? "";

  const setMonth = (next: string) =>
    setParams(next === thisMonth ? {} : { month: next }, { replace: true });

  return (
    <>
      <PageHeader
        title={isCurrent ? `${greeting()}${name ? `, ${name}` : ""}` : formatMonth(month)}
        description={
          isCurrent
            ? `Here's how ${formatMonth(month)} is going.`
            : "A look back at this month's spending."
        }
        actions={<MonthSwitcher value={month} onChange={setMonth} max={thisMonth} className="flex-1 sm:flex-none" />}
      />

      {!loading && hasBudget && (overall || overLines.length > 0) && (
        <Alert
          tone={overall ? "error" : "warning"}
          className="mb-6"
          title={
            overall
              ? `You're ${formatMoney(-summary.remaining, "whole")} over your ${formatMonth(month)} budget`
              : `${overLines.length} ${overLines.length === 1 ? "category is" : "categories are"} over budget`
          }
          action={
            <ButtonLink to={`/budgets?month=${month}`} variant="secondary" size="sm">
              Review budgets
            </ButtonLink>
          }
        >
          {overLines.length > 0
            ? `Over budget: ${overLines.map((l) => l.categoryName).join(", ")}.`
            : "Spending outside your budgeted categories pushed you over."}
        </Alert>
      )}

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard
          loading={loading}
          label="Spent"
          icon="payments"
          value={formatMoney(summary.totalSpent, "whole")}
          footer={
            change === null
              ? `${expenses.length} ${expenses.length === 1 ? "expense" : "expenses"}`
              : `${change > 0 ? "▲" : "▼"} ${Math.abs(Math.round(change))}% vs ${formatMonth(shiftMonth(month, -1), "short")}`
          }
          footerTone={change === null ? "neutral" : change > 0 ? "negative" : "positive"}
        />
        <StatCard
          loading={loading}
          label="Budget"
          icon="savings"
          value={hasBudget ? formatMoney(summary.totalBudget, "whole") : "Not set"}
          valueTone={hasBudget ? undefined : "neutral"}
          footer={
            hasBudget
              ? `${summary.lines.length} ${summary.lines.length === 1 ? "category" : "categories"} budgeted`
              : "Set budgets to track your limits"
          }
        />
        <StatCard
          loading={loading}
          label={overall ? "Over budget" : "Remaining"}
          icon="account_balance_wallet"
          value={hasBudget ? formatMoney(Math.abs(summary.remaining), "whole") : "—"}
          valueTone={!hasBudget ? "neutral" : overall ? "negative" : "positive"}
          footer={
            !hasBudget
              ? "No budget for this month"
              : overall
                ? "Spending has passed the budget"
                : isCurrent
                  ? `≈ ${formatMoney(summary.remaining / daysLeft, "whole")}/day for ${daysLeft} ${daysLeft === 1 ? "day" : "days"}`
                  : "Left unspent"
          }
          footerTone={hasBudget && overall ? "negative" : "neutral"}
        />
        <StatCard
          loading={loading}
          label="Daily average"
          icon="calendar_today"
          value={formatMoney(dailyAverage, "whole")}
          footer={
            isCurrent
              ? `On pace for ${formatMoney(projected, "whole")} this month`
              : `Across ${totalDays} days`
          }
          footerTone={
            isCurrent && hasBudget && projected > summary.totalBudget ? "warning" : "neutral"
          }
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <TrendChart />
        </div>
        <div className="xl:col-span-2">
          {loading ? (
            <Skeleton className="h-full min-h-96 rounded-2xl" />
          ) : (
            <CategoryDonut expenses={expenses} categories={categories} month={month} />
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-5">
        <Card className="overflow-hidden xl:col-span-3">
          <CardHeader
            className="pb-4"
            title="Budget health"
            description="How each category is tracking against its limit"
            action={
              <ButtonLink to={`/budgets?month=${month}`} variant="secondary" size="sm">
                Manage
              </ButtonLink>
            }
          />
          {loading ? (
            <div className="space-y-3 p-6 pt-0">
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
            </div>
          ) : summary.lines.length === 0 ? (
            <EmptyState
              icon="savings"
              title="No budgets this month"
              description="Set a limit per category to see how your spending compares."
              action={
                <ButtonLink to={`/budgets?month=${month}`} icon="add" size="sm">
                  Set up budgets
                </ButtonLink>
              }
            />
          ) : (
            <div className="border-t">
              <BudgetLines lines={summary.lines.slice(0, 6)} month={month} />
            </div>
          )}
        </Card>

        <Card className="overflow-hidden xl:col-span-2">
          <CardHeader
            className="pb-4"
            title="Recent expenses"
            description={`Latest in ${formatMonth(month)}`}
            action={
              expenses.length > 0 && (
                <ButtonLink
                  to={`/expenses?from=${month}-01&to=${lastDayOfMonth(month)}`}
                  variant="secondary"
                  size="sm"
                >
                  View all
                </ButtonLink>
              )
            }
          />
          {loading ? (
            <div className="space-y-3 p-6 pt-0">
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
            </div>
          ) : expenses.length === 0 ? (
            <EmptyState
              icon="receipt_long"
              title="No expenses yet"
              description={isCurrent ? "Add your first expense for this month." : "Nothing was logged this month."}
              action={
                isCurrent && (
                  <ButtonLink to="/expenses/new" icon="add" size="sm">
                    Add expense
                  </ButtonLink>
                )
              }
            />
          ) : (
            <div className="border-t">
              <ExpenseList flat expenses={expenses.slice(0, 6)} categories={categories} />
            </div>
          )}
        </Card>
      </div>
    </>
  );
};

export default DashboardPage;
