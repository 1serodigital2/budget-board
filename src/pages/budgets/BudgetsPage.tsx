import { useSearchParams } from "react-router-dom";
import { BudgetLines, UnbudgetedList } from "../../components/budgets/BudgetLines";
import { ProgressBar } from "../../components/ui/Badges";
import Button, { ButtonLink } from "../../components/ui/Button";
import Card, { CardHeader } from "../../components/ui/Card";
import MonthSwitcher from "../../components/ui/MonthSwitcher";
import PageHeader from "../../components/ui/PageHeader";
import { EmptyState, ErrorState, Skeleton } from "../../components/ui/States";
import { useConfirm } from "../../context/ConfirmContext";
import { useToast } from "../../context/ToastContext";
import {
  useCopyBudgets,
  useDeleteBudget,
  useMonthBudgets,
} from "../../hooks/useBudgets";
import { useCategories } from "../../hooks/useCategories";
import { useMonthExpenses } from "../../hooks/useExpenses";
import type { BudgetLine } from "../../types/budget";
import { budgetStatus, buildBudgetSummary } from "../../utils/budgetSummary";
import {
  currentMonthKey,
  daysInMonth,
  formatMoney,
  formatMonth,
  getErrorMessage,
  isMonthKey,
  shiftMonth,
} from "../../utils/helpers";

const BudgetsPage = () => {
  const [params, setParams] = useSearchParams();
  const monthParam = params.get("month")?.slice(0, 7);
  const month = isMonthKey(monthParam) ? monthParam : currentMonthKey();
  const previousMonth = shiftMonth(month, -1);

  const confirm = useConfirm();
  const toast = useToast();
  const budgetsQuery = useMonthBudgets(month);
  const previousBudgets = useMonthBudgets(previousMonth);
  const expensesQuery = useMonthExpenses(month);
  const categoriesQuery = useCategories();
  const deleteBudget = useDeleteBudget();
  const copyBudgets = useCopyBudgets();

  const setMonth = (next: string) =>
    setParams(next === currentMonthKey() ? {} : { month: next }, { replace: true });

  const loading =
    budgetsQuery.isPending || expensesQuery.isPending || categoriesQuery.isPending;
  const error = budgetsQuery.error ?? expensesQuery.error ?? categoriesQuery.error;

  const summary = buildBudgetSummary(
    budgetsQuery.data ?? [],
    expensesQuery.data ?? [],
    categoriesQuery.data ?? [],
  );
  const usedPercent =
    summary.totalBudget > 0 ? (summary.budgetedSpent / summary.totalBudget) * 100 : 0;
  const budgetedRemaining = summary.totalBudget - summary.budgetedSpent;
  const over = budgetedRemaining < 0;
  const isCurrentMonth = month === currentMonthKey();
  const daysLeft = daysInMonth(month) - new Date().getDate() + 1; // including today

  const budgetedNow = new Set((budgetsQuery.data ?? []).map((b) => b.categoryId));
  const copyable = (previousBudgets.data ?? []).filter((b) => !budgetedNow.has(b.categoryId));

  const handleCopy = async () => {
    try {
      const count = await copyBudgets.mutateAsync({ from: previousMonth, to: month });
      toast.success(
        count > 0
          ? `Copied ${count} ${count === 1 ? "budget" : "budgets"} from ${formatMonth(previousMonth)}`
          : "Nothing new to copy",
      );
    } catch (err) {
      toast.error(getErrorMessage(err, "Unable to copy budgets"));
    }
  };

  const handleDelete = async (line: BudgetLine) => {
    const ok = await confirm({
      title: `Delete the ${line.categoryName} budget?`,
      description: `The ${formatMoney(line.budget, "whole")} limit for ${formatMonth(month)} will be removed. Expenses are not affected.`,
      confirmLabel: "Delete budget",
    });
    if (!ok) return;
    try {
      await deleteBudget.mutateAsync(line.budgetId);
      toast.success("Budget deleted");
    } catch (err) {
      toast.error(getErrorMessage(err, "Unable to delete budget"));
    }
  };

  const copyButton = copyable.length > 0 && (
    <Button variant="secondary" size="sm" icon="content_copy" loading={copyBudgets.isPending} onClick={handleCopy}>
      Copy {copyable.length} from {formatMonth(previousMonth, "short")}
    </Button>
  );

  return (
    <>
      <PageHeader
        title="Budgets"
        description="Monthly spending limits for each category."
        actions={
          <>
            <MonthSwitcher value={month} onChange={setMonth} className="flex-1 sm:flex-none" />
            {/* Icon-only on phones so it fits beside the month switcher. */}
            <ButtonLink
              to={`/budgets/new?month=${month}`}
              icon="add"
              aria-label="New budget"
              className="max-sm:w-10 max-sm:px-0"
            >
              <span className="hidden sm:inline">New budget</span>
            </ButtonLink>
          </>
        }
      />

      {loading ? (
        <div className="space-y-6">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-72 rounded-2xl" />
        </div>
      ) : error ? (
        <Card>
          <ErrorState
            error={error}
            onRetry={() => {
              budgetsQuery.refetch();
              expensesQuery.refetch();
              categoriesQuery.refetch();
            }}
          />
        </Card>
      ) : (
        <div className="space-y-6">
          {summary.lines.length > 0 && (
            <Card className="p-5 sm:p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                {/* Headline: what's left (or how far over) */}
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-muted-foreground">
                    {over ? "Over budget by" : "Left to spend"}
                  </p>
                  <p
                    className={`tabular mt-1 truncate text-3xl font-semibold tracking-tight sm:text-4xl ${
                      over ? "text-destructive" : "text-foreground"
                    }`}
                  >
                    {formatMoney(Math.abs(budgetedRemaining), "whole")}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {!over && isCurrentMonth
                      ? `≈ ${formatMoney(budgetedRemaining / daysLeft, "whole")}/day for the next ${daysLeft} ${daysLeft === 1 ? "day" : "days"}`
                      : formatMonth(month)}
                  </p>
                </div>

                {/* Supporting figures */}
                <dl className="grid grid-cols-2 divide-x rounded-xl border bg-muted/40 sm:min-w-72">
                  <div className="min-w-0 px-4 py-3">
                    <dt className="text-xs text-muted-foreground">Budgeted</dt>
                    <dd className="tabular mt-0.5 truncate text-base font-semibold">
                      {formatMoney(summary.totalBudget, "whole")}
                    </dd>
                  </div>
                  <div className="min-w-0 px-4 py-3">
                    <dt className="text-xs text-muted-foreground">Spent</dt>
                    <dd className="tabular mt-0.5 truncate text-base font-semibold">
                      {formatMoney(summary.budgetedSpent, "whole")}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="mt-5 flex items-center gap-3">
                <ProgressBar percentage={usedPercent} status={budgetStatus(usedPercent)} className="h-2" />
                <span className="tabular shrink-0 text-xs font-medium text-muted-foreground">
                  {Math.round(usedPercent)}% used
                </span>
              </div>
            </Card>
          )}

          <Card className="overflow-hidden">
            <CardHeader
              className="pb-4"
              title={`Category budgets · ${formatMonth(month)}`}
              description={
                summary.lines.length > 0
                  ? `${summary.lines.length} ${summary.lines.length === 1 ? "budget" : "budgets"} · click a category to see its expenses`
                  : undefined
              }
              action={summary.lines.length > 0 ? copyButton : undefined}
            />
            {summary.lines.length === 0 ? (
              <EmptyState
                icon="savings"
                title={`No budgets for ${formatMonth(month)}`}
                description={
                  copyable.length > 0
                    ? `Start from last month's ${copyable.length} ${copyable.length === 1 ? "budget" : "budgets"}, or create one from scratch.`
                    : "Set a monthly limit for a category to track how your spending compares."
                }
                action={
                  <div className="flex flex-wrap justify-center gap-2">
                    {copyButton}
                    <ButtonLink
                      to={`/budgets/new?month=${month}`}
                      icon="add"
                      size="sm"
                      variant={copyable.length > 0 ? "secondary" : "primary"}
                    >
                      Create budget
                    </ButtonLink>
                  </div>
                }
              />
            ) : (
              <div className="border-t">
                <BudgetLines
                  lines={summary.lines}
                  month={month}
                  onDelete={handleDelete}
                  deletingId={deleteBudget.isPending ? deleteBudget.variables : undefined}
                />
              </div>
            )}
          </Card>

          {summary.unbudgeted.length > 0 && (
            <Card className="overflow-hidden">
              <CardHeader
                className="pb-4"
                title="Spending without a budget"
                description={`${formatMoney(
                  summary.unbudgeted.reduce((sum, u) => sum + u.spent, 0),
                  "whole",
                )} spent in categories you haven't budgeted for`}
              />
              <div className="border-t">
                <UnbudgetedList items={summary.unbudgeted} month={month} />
              </div>
            </Card>
          )}
        </div>
      )}
    </>
  );
};

export default BudgetsPage;
