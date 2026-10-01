import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import ExpenseFilters from "../../components/expenses/ExpenseFilters";
import ExpenseList from "../../components/expenses/ExpenseList";
import Button, { ButtonLink } from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import PageHeader from "../../components/ui/PageHeader";
import { EmptyState, ErrorState, Skeleton } from "../../components/ui/States";
import { useCategories } from "../../hooks/useCategories";
import { useExpenseList } from "../../hooks/useExpenses";
import type { Category } from "../../types/category";
import type { ExpenseFilters as Filters } from "../../types/expense";
import { isDateKey, isMonthKey, lastDayOfMonth } from "../../utils/helpers";

/** Reads filters from the URL, including the older `month` and slug formats. */
const readFilters = (params: URLSearchParams, categories: Category[]): Filters => {
  const filters: Filters = {};

  const category = params.get("category");
  if (category) {
    filters.categoryId = /^\d+$/.test(category)
      ? Number(category)
      : categories.find((c) => c.slug === category)?.id;
  }

  const month = params.get("month")?.slice(0, 7);
  if (isMonthKey(month)) {
    filters.from = `${month}-01`;
    filters.to = lastDayOfMonth(month);
  }
  const from = params.get("from");
  const to = params.get("to");
  if (isDateKey(from)) filters.from = from;
  if (isDateKey(to)) filters.to = to;

  const q = params.get("q");
  if (q) filters.search = q;
  return filters;
};

const ListSkeleton = () => (
  <div className="divide-y">
    {Array.from({ length: 6 }, (_, i) => (
      <div key={i} className="flex items-center gap-3 px-4 py-3.5 sm:px-6">
        <Skeleton className="size-9 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3.5 w-40" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-4 w-16" />
      </div>
    ))}
  </div>
);

const ExpensesPage = () => {
  const [params, setParams] = useSearchParams();
  const { data: categories = [], isLoading: loadingCategories } = useCategories();

  const filters = useMemo(() => readFilters(params, categories), [params, categories]);

  const setFilters = useCallback(
    (next: Filters) => {
      const out = new URLSearchParams();
      if (next.categoryId) out.set("category", String(next.categoryId));
      if (next.from) out.set("from", next.from);
      if (next.to) out.set("to", next.to);
      if (next.search) out.set("q", next.search);
      setParams(out, { replace: true });
    },
    [setParams],
  );

  const {
    data,
    isPending,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPlaceholderData,
  } = useExpenseList(filters);

  const expenses = data?.pages.flatMap((page) => page.expenses) ?? [];
  const total = data?.pages[0]?.total ?? 0;
  const hasFilters = !!(filters.categoryId || filters.from || filters.to || filters.search);
  const loading = isPending || loadingCategories;

  return (
    <>
      <PageHeader
        title="Expenses"
        description={
          loading
            ? "Every expense you've logged."
            : `${total.toLocaleString("en-IN")} ${total === 1 ? "expense" : "expenses"}${hasFilters ? " match your filters" : " logged"}`
        }
        actions={
          <ButtonLink to="/expenses/new" icon="add">
            Add expense
          </ButtonLink>
        }
      />

      <Card className="overflow-hidden">
        <ExpenseFilters
          filters={filters}
          categories={categories}
          onChange={setFilters}
        />

        {loading ? (
          <ListSkeleton />
        ) : isError ? (
          <ErrorState error={error} onRetry={() => refetch()} />
        ) : expenses.length === 0 ? (
          hasFilters ? (
            <EmptyState
              icon="search_off"
              title="No matching expenses"
              description="Try a different category, date range or search term."
              action={
                <Button variant="secondary" onClick={() => setFilters({})}>
                  Clear filters
                </Button>
              }
            />
          ) : (
            <EmptyState
              icon="receipt_long"
              title="No expenses yet"
              description="Log your first expense to start tracking where your money goes."
              action={
                <ButtonLink to="/expenses/new" icon="add">
                  Add expense
                </ButtonLink>
              }
            />
          )
        ) : (
          <div className={isPlaceholderData ? "opacity-60 transition-opacity" : ""}>
            <ExpenseList expenses={expenses} categories={categories} />
            <div className="flex flex-col items-center gap-3 border-t px-4 py-4 sm:flex-row sm:justify-between sm:px-6">
              <p className="text-xs text-muted-foreground">
                Showing {expenses.length.toLocaleString("en-IN")} of{" "}
                {total.toLocaleString("en-IN")}
              </p>
              {hasNextPage && (
                <Button
                  variant="secondary"
                  size="sm"
                  loading={isFetchingNextPage}
                  onClick={() => fetchNextPage()}
                >
                  Load more
                </Button>
              )}
            </div>
          </div>
        )}
      </Card>
    </>
  );
};

export default ExpensesPage;
