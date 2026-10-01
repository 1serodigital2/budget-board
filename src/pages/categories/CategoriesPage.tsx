import { Link } from "react-router-dom";
import { useDeleteCategoryAction } from "../../components/categories/useDeleteCategoryAction";
import { Badge, CategoryAvatar, ProgressBar } from "../../components/ui/Badges";
import { ButtonLink } from "../../components/ui/Button";
import { buttonClasses } from "../../components/ui/buttonClasses";
import Card from "../../components/ui/Card";
import Icon from "../../components/ui/Icon";
import PageHeader from "../../components/ui/PageHeader";
import Spinner from "../../components/ui/Spinner";
import { ErrorState, Skeleton } from "../../components/ui/States";
import { useMonthBudgets } from "../../hooks/useBudgets";
import { useCategories } from "../../hooks/useCategories";
import { useMonthExpenses } from "../../hooks/useExpenses";
import { budgetStatus } from "../../utils/budgetSummary";
import { currentMonthKey, formatMoney, formatMonth } from "../../utils/helpers";

const CategoriesPage = () => {
  const month = currentMonthKey();
  const { data: categories, isPending, isError, error, refetch } = useCategories();
  const { data: expenses = [] } = useMonthExpenses(month);
  const { data: budgets = [] } = useMonthBudgets(month);
  const deleteAction = useDeleteCategoryAction();

  const stats = new Map<number, { spent: number; count: number }>();
  for (const e of expenses) {
    const s = stats.get(e.categoryId) ?? { spent: 0, count: 0 };
    s.spent += e.amount;
    s.count += 1;
    stats.set(e.categoryId, s);
  }
  const budgetByCategory = new Map(budgets.map((b) => [b.categoryId, b.amount]));

  return (
    <>
      <PageHeader
        title="Categories"
        description={`Group your spending. Figures show ${formatMonth(month)}.`}
        actions={
          <ButtonLink to="/categories/new" icon="add">
            New category
          </ButtonLink>
        }
      />

      {isPending ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-36 rounded-2xl" />
          ))}
        </div>
      ) : isError ? (
        <Card>
          <ErrorState error={error} onRetry={() => refetch()} />
        </Card>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => {
            const stat = stats.get(category.id) ?? { spent: 0, count: 0 };
            const budget = budgetByCategory.get(category.id);
            const percentage = budget ? (stat.spent / budget) * 100 : 0;
            const deleting = deleteAction.pendingId === category.id;

            return (
              <li key={category.id}>
                <Card
                  className={`group relative flex h-full flex-col p-5 transition-shadow hover:shadow-md ${
                    deleting ? "opacity-50" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <CategoryAvatar name={category.name} color={category.color} />
                    <div className="min-w-0 flex-1">
                      <Link
                        to={`/categories/${category.id}`}
                        className="block truncate text-[15px] font-semibold text-foreground after:absolute after:inset-0 after:rounded-2xl"
                      >
                        {category.name}
                      </Link>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {stat.count} {stat.count === 1 ? "expense" : "expenses"} this month
                      </p>
                    </div>
                    {category.isSystem ? (
                      <Badge>System</Badge>
                    ) : (
                      <div className="relative z-10 -mt-1 -mr-2 flex sm:opacity-0 sm:group-focus-within:opacity-100 sm:group-hover:opacity-100">
                        <Link
                          to={`/categories/${category.id}/edit`}
                          className={buttonClasses("ghost", "icon-sm")}
                          aria-label={`Edit ${category.name}`}
                          title="Edit"
                        >
                          <Icon name="edit" size={18} />
                        </Link>
                        <button
                          type="button"
                          disabled={deleting}
                          onClick={() => deleteAction.run(category)}
                          className={buttonClasses("danger-ghost", "icon-sm")}
                          aria-label={`Delete ${category.name}`}
                          title="Delete"
                        >
                          {deleting ? <Spinner size={16} /> : <Icon name="delete" size={18} />}
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="mt-5 flex items-end justify-between gap-2">
                    <p className="tabular text-xl font-semibold tracking-tight">
                      {formatMoney(stat.spent, "whole")}
                    </p>
                    {budget ? (
                      <p className="tabular text-xs text-muted-foreground">
                        of {formatMoney(budget, "whole")}
                      </p>
                    ) : (
                      <p className="text-xs text-subtle">No budget</p>
                    )}
                  </div>
                  <div className="mt-2">
                    {budget ? (
                      <ProgressBar percentage={percentage} status={budgetStatus(percentage)} />
                    ) : (
                      <div className="h-1.5 rounded-full bg-muted" />
                    )}
                  </div>
                </Card>
              </li>
            );
          })}
          <li>
            <Link
              to="/categories/new"
              className="flex h-full min-h-36 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
            >
              <Icon name="add_circle" size={24} />
              Add category
            </Link>
          </li>
        </ul>
      )}
    </>
  );
};

export default CategoriesPage;
