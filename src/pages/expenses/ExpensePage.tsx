import type { ReactNode } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CategoryAvatar } from "../../components/ui/Badges";
import Button, { ButtonLink } from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Icon from "../../components/ui/Icon";
import PageHeader from "../../components/ui/PageHeader";
import { PageLoader } from "../../components/ui/Spinner";
import { ErrorState } from "../../components/ui/States";
import { useConfirm } from "../../context/ConfirmContext";
import { useToast } from "../../context/ToastContext";
import { useCategories } from "../../hooks/useCategories";
import { useDeleteExpense, useExpense } from "../../hooks/useExpenses";
import {
  formatDate,
  formatDateTime,
  formatMoney,
  getErrorMessage,
} from "../../utils/helpers";

const DetailRow = ({ icon, label, children }: { icon: string; label: string; children: ReactNode }) => (
  <div className="flex items-start gap-4 px-5 py-4 sm:px-6">
    <Icon name={icon} className="mt-0.5 text-muted-foreground" />
    <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between sm:gap-6">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium break-words text-foreground sm:mt-0 sm:text-right">
        {children}
      </dd>
    </div>
  </div>
);

const ExpensePage = () => {
  const id = Number(useParams().id);
  const navigate = useNavigate();
  const confirm = useConfirm();
  const toast = useToast();
  const { data: expense, isPending, isError, error, refetch } = useExpense(id);
  const { data: categories = [] } = useCategories();
  const deleteExpense = useDeleteExpense();

  if (isPending) return <PageLoader label="Loading expense…" />;

  const back = { to: "/expenses", label: "Expenses" };
  if (isError) {
    return (
      <>
        <PageHeader back={back} title="Expense" />
        <ErrorState error={error} onRetry={() => refetch()} />
      </>
    );
  }

  const category = categories.find((c) => c.id === expense.categoryId);
  const categoryName = category?.name ?? "Uncategorized";

  const handleDelete = async () => {
    const ok = await confirm({
      title: "Delete this expense?",
      description: `${formatMoney(expense.amount)} on ${formatDate(expense.date)} will be permanently removed.`,
      confirmLabel: "Delete expense",
    });
    if (!ok) return;
    try {
      await deleteExpense.mutateAsync(expense.id);
      toast.success("Expense deleted");
      navigate("/expenses", { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err, "Unable to delete expense"));
    }
  };

  return (
    <>
      <PageHeader
        back={back}
        title="Expense details"
        actions={
          <>
            <Button
              variant="secondary"
              icon="delete"
              onClick={handleDelete}
              loading={deleteExpense.isPending}
              className="hover:text-destructive"
            >
              Delete
            </Button>
            <ButtonLink to={`/expenses/${expense.id}/edit`} icon="edit">
              Edit
            </ButtonLink>
          </>
        }
      />

      <Card className="max-w-2xl overflow-hidden">
        <div className="flex items-center gap-4 border-b px-5 py-6 sm:px-6">
          <CategoryAvatar name={categoryName} color={category?.color ?? "#94a3b8"} size="lg" />
          <div className="min-w-0">
            <p className="tabular text-3xl font-semibold tracking-tight">
              {formatMoney(expense.amount)}
            </p>
            <p className="mt-0.5 truncate text-sm text-muted-foreground">
              {expense.note || "No note"}
            </p>
          </div>
        </div>
        <dl className="divide-y">
          <DetailRow icon="sell" label="Category">
            {category ? (
              <Link to={`/categories/${category.id}`} className="text-primary hover:underline">
                {categoryName}
              </Link>
            ) : (
              categoryName
            )}
          </DetailRow>
          <DetailRow icon="calendar_today" label="Date">
            {formatDate(expense.date, {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </DetailRow>
          <DetailRow icon="notes" label="Note">
            {expense.note || <span className="text-muted-foreground">—</span>}
          </DetailRow>
          <DetailRow icon="schedule" label="Logged">
            {formatDateTime(expense.createdAt)}
          </DetailRow>
        </dl>
      </Card>
    </>
  );
};

export default ExpensePage;
