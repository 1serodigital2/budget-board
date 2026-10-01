import { Link } from "react-router-dom";
import type { BudgetLine, UnbudgetedSpend } from "../../types/budget";
import { formatMoney, formatPercent, lastDayOfMonth } from "../../utils/helpers";
import { CategoryAvatar, StatusBadge, ProgressBar } from "../ui/Badges";
import { buttonClasses } from "../ui/buttonClasses";
import Icon from "../ui/Icon";
import Spinner from "../ui/Spinner";

const expensesLink = (categoryId: number, month: string) =>
  `/expenses?category=${categoryId}&from=${month}-01&to=${lastDayOfMonth(month)}`;

const COLUMNS =
  "md:grid-cols-[minmax(0,1.6fr)_repeat(3,minmax(0,0.9fr))_minmax(0,1.3fr)_6rem]";

interface BudgetLinesProps {
  lines: BudgetLine[];
  month: string;
  /** Show edit/delete controls. */
  onDelete?: (line: BudgetLine) => void;
  deletingId?: number;
}

export const BudgetLines = ({ lines, month, onDelete, deletingId }: BudgetLinesProps) => (
  <div>
    <div
      className={`hidden gap-4 border-b bg-muted/40 px-6 py-2.5 text-xs font-medium text-muted-foreground md:grid ${COLUMNS}`}
    >
      <span>Category</span>
      <span className="text-right">Budget</span>
      <span className="text-right">Spent</span>
      <span className="text-right">Remaining</span>
      <span>Progress</span>
      <span className="text-right">{onDelete ? <span className="sr-only">Actions</span> : "Status"}</span>
    </div>
    <ul className="divide-y">
      {lines.map((line) => {
        const deleting = deletingId === line.budgetId;
        return (
          <li
            key={line.budgetId}
            className={`group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2.5 px-4 py-4 transition-colors hover:bg-muted/40 sm:px-6 ${COLUMNS} ${
              deleting ? "opacity-50" : ""
            }`}
          >
            <Link
              to={expensesLink(line.categoryId, month)}
              className="flex min-w-0 items-center gap-3"
              title="View expenses"
            >
              <CategoryAvatar name={line.categoryName} color={line.categoryColor} size="sm" />
              <span className="truncate text-sm font-medium text-foreground hover:underline">
                {line.categoryName}
              </span>
            </Link>

            {/* Mobile: status in the first row */}
            <span className="md:hidden">
              <StatusBadge status={line.status} />
            </span>

            <span className="tabular hidden text-right text-sm md:block">
              {formatMoney(line.budget, "whole")}
            </span>
            <span className="tabular hidden text-right text-sm md:block">
              {formatMoney(line.spent, "whole")}
            </span>
            <span
              className={`tabular hidden text-right text-sm font-medium md:block ${
                line.remaining < 0 ? "text-destructive" : "text-foreground"
              }`}
            >
              {line.remaining < 0 && "−"}
              {formatMoney(Math.abs(line.remaining), "whole")}
            </span>

            <div className="col-span-2 flex items-center gap-3 md:col-span-1">
              <ProgressBar percentage={line.percentage} status={line.status} className="h-2" />
              <span className="tabular w-11 shrink-0 text-right text-xs font-medium text-muted-foreground">
                {formatPercent(line.percentage)}
              </span>
            </div>

            {/* Mobile: amounts summary */}
            <p className="tabular text-xs text-muted-foreground md:hidden">
              {formatMoney(line.spent, "whole")} of {formatMoney(line.budget, "whole")}
            </p>

            <div className="flex items-center justify-end">
              {onDelete ? (
                <div className="flex md:opacity-0 md:group-focus-within:opacity-100 md:group-hover:opacity-100">
                  <Link
                    to={`/budgets/${line.budgetId}/edit`}
                    className={buttonClasses("ghost", "icon-sm")}
                    aria-label={`Edit ${line.categoryName} budget`}
                    title="Edit"
                  >
                    <Icon name="edit" size={18} />
                  </Link>
                  <button
                    type="button"
                    disabled={deleting}
                    onClick={() => onDelete(line)}
                    className={buttonClasses("danger-ghost", "icon-sm")}
                    aria-label={`Delete ${line.categoryName} budget`}
                    title="Delete"
                  >
                    {deleting ? <Spinner size={16} /> : <Icon name="delete" size={18} />}
                  </button>
                </div>
              ) : (
                <span className="hidden md:inline-flex">
                  <StatusBadge status={line.status} />
                </span>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  </div>
);

export const UnbudgetedList = ({
  items,
  month,
}: {
  items: UnbudgetedSpend[];
  month: string;
}) => (
  <ul className="divide-y">
    {items.map((item) => (
      <li key={item.categoryId} className="flex items-center gap-3 px-4 py-3 sm:px-6">
        <Link
          to={expensesLink(item.categoryId, month)}
          className="flex min-w-0 flex-1 items-center gap-3"
        >
          <CategoryAvatar name={item.categoryName} color={item.categoryColor} size="sm" />
          <span className="truncate text-sm font-medium hover:underline">{item.categoryName}</span>
        </Link>
        <span className="tabular text-sm font-medium">{formatMoney(item.spent, "whole")}</span>
        <Link
          to={`/budgets/new?month=${month}&category=${item.categoryId}`}
          className={buttonClasses("ghost", "sm", "text-primary")}
        >
          Set budget
        </Link>
      </li>
    ))}
  </ul>
);
