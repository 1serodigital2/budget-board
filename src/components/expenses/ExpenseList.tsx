import { Link } from "react-router-dom";
import { useConfirm } from "../../context/ConfirmContext";
import { useToast } from "../../context/ToastContext";
import { useDeleteExpense } from "../../hooks/useExpenses";
import type { Category } from "../../types/category";
import type { Expense } from "../../types/expense";
import {
  addDays,
  formatDate,
  formatMoney,
  getErrorMessage,
  todayKey,
} from "../../utils/helpers";
import { CategoryAvatar } from "../ui/Badges";
import { buttonClasses } from "../ui/buttonClasses";
import Icon from "../ui/Icon";
import Spinner from "../ui/Spinner";

const dayLabel = (dateKey: string) => {
  const today = todayKey();
  if (dateKey === today) return "Today";
  if (dateKey === addDays(today, -1)) return "Yesterday";
  return formatDate(dateKey, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: dateKey.slice(0, 4) === today.slice(0, 4) ? undefined : "numeric",
  });
};

const groupByDay = (expenses: Expense[]) => {
  const groups: { date: string; total: number; items: Expense[] }[] = [];
  for (const expense of expenses) {
    const last = groups[groups.length - 1];
    if (last && last.date === expense.date) {
      last.items.push(expense);
      last.total += expense.amount;
    } else {
      groups.push({ date: expense.date, total: expense.amount, items: [expense] });
    }
  }
  return groups;
};

interface ExpenseListProps {
  expenses: Expense[];
  categories: Category[];
  /** Hide per-day headers, e.g. for short "recent" lists. */
  flat?: boolean;
}

const ExpenseList = ({ expenses, categories, flat = false }: ExpenseListProps) => {
  const confirm = useConfirm();
  const toast = useToast();
  const deleteExpense = useDeleteExpense();
  const categoryById = new Map(categories.map((c) => [c.id, c]));

  const handleDelete = async (expense: Expense) => {
    const ok = await confirm({
      title: "Delete this expense?",
      description: `${formatMoney(expense.amount)} on ${formatDate(expense.date)} will be permanently removed.`,
      confirmLabel: "Delete expense",
    });
    if (!ok) return;
    try {
      await deleteExpense.mutateAsync(expense.id);
      toast.success("Expense deleted");
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to delete expense"));
    }
  };

  const renderRow = (expense: Expense) => {
    const category = categoryById.get(expense.categoryId);
    const categoryName = category?.name ?? "Uncategorized";
    const deleting = deleteExpense.isPending && deleteExpense.variables === expense.id;

    return (
      <li
        key={expense.id}
        className={`group flex items-center gap-2 px-4 py-3 transition-colors hover:bg-muted/50 sm:px-6 ${
          deleting ? "opacity-50" : ""
        }`}
      >
        <Link
          to={`/expenses/${expense.id}`}
          className="flex min-w-0 flex-1 items-center gap-3 rounded-lg"
        >
          <CategoryAvatar name={categoryName} color={category?.color ?? "#94a3b8"} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">
              {expense.note || categoryName}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {categoryName}
              {flat && <> · {dayLabel(expense.date)}</>}
            </p>
          </div>
          <span className="tabular ml-2 text-sm font-semibold whitespace-nowrap text-foreground">
            {formatMoney(expense.amount)}
          </span>
        </Link>
        <div className="flex items-center transition-opacity sm:opacity-0 sm:group-focus-within:opacity-100 sm:group-hover:opacity-100">
          <Link
            to={`/expenses/${expense.id}/edit`}
            className={buttonClasses("ghost", "icon-sm")}
            aria-label={`Edit expense ${expense.note || categoryName}`}
            title="Edit"
          >
            <Icon name="edit" size={18} />
          </Link>
          <button
            type="button"
            onClick={() => handleDelete(expense)}
            disabled={deleting}
            className={buttonClasses("danger-ghost", "icon-sm")}
            aria-label={`Delete expense ${expense.note || categoryName}`}
            title="Delete"
          >
            {deleting ? <Spinner size={16} /> : <Icon name="delete" size={18} />}
          </button>
        </div>
      </li>
    );
  };

  if (flat) {
    return <ul className="divide-y">{expenses.map(renderRow)}</ul>;
  }

  return (
    <div>
      {groupByDay(expenses).map((group) => (
        <section key={group.date} aria-label={dayLabel(group.date)}>
          <div className="flex items-center justify-between border-y bg-muted/40 px-4 py-2 text-xs font-medium text-muted-foreground first:border-t-0 sm:px-6">
            <span>{dayLabel(group.date)}</span>
            <span className="tabular">{formatMoney(group.total)}</span>
          </div>
          <ul className="divide-y">{group.items.map(renderRow)}</ul>
        </section>
      ))}
    </div>
  );
};

export default ExpenseList;
