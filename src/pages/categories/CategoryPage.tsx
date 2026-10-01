import type { ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDeleteCategoryAction } from "../../components/categories/useDeleteCategoryAction";
import ExpenseList from "../../components/expenses/ExpenseList";
import { Badge, CategoryAvatar, ProgressBar } from "../../components/ui/Badges";
import Button, { ButtonLink } from "../../components/ui/Button";
import Card, { CardHeader } from "../../components/ui/Card";
import PageHeader from "../../components/ui/PageHeader";
import { PageLoader } from "../../components/ui/Spinner";
import { EmptyState, ErrorState } from "../../components/ui/States";
import { useMonthBudgets } from "../../hooks/useBudgets";
import { useCategories, useCategory } from "../../hooks/useCategories";
import { useExpenseList, useMonthExpenses } from "../../hooks/useExpenses";
import { budgetStatus } from "../../utils/budgetSummary";
import {
  currentMonthKey,
  formatMoney,
  formatMonth,
  shiftMonth,
} from "../../utils/helpers";

const Stat = ({ label, value, footer }: { label: string; value: string; footer?: ReactNode }) => (
  <Card className="p-5">
    <p className="text-[13px] font-medium text-muted-foreground">{label}</p>
    <p className="tabular mt-2 text-2xl font-semibold tracking-tight">{value}</p>
    {footer && <div className="mt-3 text-xs text-muted-foreground">{footer}</div>}
  </Card>
);

const CategoryPage = () => {
  const id = Number(useParams().id);
  const navigate = useNavigate();
  const month = currentMonthKey();
  const previous = shiftMonth(month, -1);

  const { data: category, isPending, isError, error, refetch } = useCategory(id);
  const { data: categories = [] } = useCategories();
  const { data: monthExpenses = [] } = useMonthExpenses(month);
  const { data: lastMonthExpenses = [] } = useMonthExpenses(previous);
  const { data: budgets = [] } = useMonthBudgets(month);
  const recent = useExpenseList({ categoryId: id });
  const deleteAction = useDeleteCategoryAction();

  if (isPending) return <PageLoader label="Loading category…" />;
  const back = { to: "/categories", label: "Categories" };
  if (isError) {
    return (
      <>
        <PageHeader back={back} title="Category" />
        <Card>
          <ErrorState error={error} onRetry={() => refetch()} />
        </Card>
      </>
    );
  }

  const sum = (list: { categoryId: number; amount: number }[]) =>
    list.filter((e) => e.categoryId === id).reduce((total, e) => total + e.amount, 0);
  const spent = sum(monthExpenses);
  const lastSpent = sum(lastMonthExpenses);
  const budget = budgets.find((b) => b.categoryId === id);
  const percentage = budget ? (spent / budget.amount) * 100 : 0;
  const change = lastSpent > 0 ? ((spent - lastSpent) / lastSpent) * 100 : null;

  const recentExpenses = recent.data?.pages[0]?.expenses ?? [];
  const totalCount = recent.data?.pages[0]?.total ?? 0;

  return (
    <>
      <PageHeader
        back={back}
        title={
          <span className="flex items-center gap-3">
            <CategoryAvatar name={category.name} color={category.color} />
            <span className="truncate">{category.name}</span>
            {category.isSystem && <Badge>System</Badge>}
          </span>
        }
        actions={
          !category.isSystem && (
            <>
              <Button
                variant="secondary"
                icon="delete"
                className="hover:text-destructive"
                loading={deleteAction.pendingId === category.id}
                onClick={async () => {
                  if (await deleteAction.run(category)) navigate("/categories", { replace: true });
                }}
              >
                Delete
              </Button>
              <ButtonLink to={`/categories/${category.id}/edit`} icon="edit">
                Edit
              </ButtonLink>
            </>
          )
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat
          label={`Spent in ${formatMonth(month, "short")}`}
          value={formatMoney(spent)}
          footer={
            change === null ? (
              "No spending last month"
            ) : (
              <span className={change > 0 ? "text-destructive" : "text-success"}>
                {change > 0 ? "▲" : "▼"} {Math.abs(Math.round(change))}% vs last month
              </span>
            )
          }
        />
        <Stat
          label="Monthly budget"
          value={budget ? formatMoney(budget.amount) : "Not set"}
          footer={
            budget ? (
              <div className="space-y-2">
                <ProgressBar percentage={percentage} status={budgetStatus(percentage)} />
                <p>
                  {budget.amount - spent >= 0
                    ? `${formatMoney(budget.amount - spent)} left`
                    : `${formatMoney(spent - budget.amount)} over budget`}
                </p>
              </div>
            ) : (
              <ButtonLink
                to={`/budgets/new?month=${month}&category=${category.id}`}
                variant="ghost"
                size="sm"
                icon="add"
                className="-ml-3 text-primary"
              >
                Set a budget
              </ButtonLink>
            )
          }
        />
        <Stat label={`Spent in ${formatMonth(previous, "short")}`} value={formatMoney(lastSpent)} />
      </div>

      <Card className="mt-6 overflow-hidden">
        <CardHeader
          className="pb-4"
          title="Recent expenses"
          description={`${totalCount} in total`}
          action={
            totalCount > recentExpenses.length ? (
              <ButtonLink to={`/expenses?category=${category.id}`} variant="secondary" size="sm">
                View all
              </ButtonLink>
            ) : undefined
          }
        />
        {recent.isPending ? (
          <PageLoader />
        ) : recentExpenses.length === 0 ? (
          <EmptyState
            icon="receipt_long"
            title="No expenses in this category"
            action={
              <ButtonLink to="/expenses/new" icon="add" variant="secondary">
                Add expense
              </ButtonLink>
            }
          />
        ) : (
          <div className="border-t">
            <ExpenseList expenses={recentExpenses} categories={categories} />
          </div>
        )}
      </Card>
    </>
  );
};

export default CategoryPage;
