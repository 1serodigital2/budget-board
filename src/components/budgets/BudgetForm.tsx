import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useMonthBudgets } from "../../hooks/useBudgets";
import { useCategories } from "../../hooks/useCategories";
import { useMonthExpenses } from "../../hooks/useExpenses";
import type { BudgetInput } from "../../types/budget";
import {
  currentMonthKey,
  formatMoney,
  formatMonth,
  isMonthKey,
  shiftMonth,
} from "../../utils/helpers";
import { Field, Input, MoneyInput, Select } from "../form/Fields";
import Button from "../ui/Button";
import { buttonClasses } from "../ui/buttonClasses";
import Card from "../ui/Card";

interface BudgetFormProps {
  initialValues?: Partial<BudgetInput>;
  /** The budget being edited, so its own category stays selectable. */
  budgetId?: number;
  submitLabel: string;
  submitting: boolean;
  onSubmit: (input: BudgetInput) => Promise<void>;
  cancelTo: string;
}

type Errors = Partial<Record<"categoryId" | "month" | "amount", string>>;

const BudgetForm = ({
  initialValues,
  budgetId,
  submitLabel,
  submitting,
  onSubmit,
  cancelTo,
}: BudgetFormProps) => {
  const [categoryId, setCategoryId] = useState(
    initialValues?.categoryId ? String(initialValues.categoryId) : "",
  );
  const [month, setMonth] = useState(initialValues?.month ?? currentMonthKey());
  const [amount, setAmount] = useState(
    initialValues?.amount ? String(initialValues.amount) : "",
  );
  const [errors, setErrors] = useState<Errors>({});

  const validMonth = isMonthKey(month) ? month : currentMonthKey();
  const { data: categories = [], isLoading } = useCategories();
  const { data: monthBudgets = [] } = useMonthBudgets(validMonth);
  const { data: previousExpenses } = useMonthExpenses(shiftMonth(validMonth, -1));

  const taken = new Set(
    monthBudgets.filter((b) => b.id !== budgetId).map((b) => b.categoryId),
  );
  const lastMonthSpend = categoryId
    ? (previousExpenses ?? [])
        .filter((e) => e.categoryId === Number(categoryId))
        .reduce((sum, e) => sum + e.amount, 0)
    : 0;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const next: Errors = {};
    if (!categoryId) next.categoryId = "Choose a category";
    else if (taken.has(Number(categoryId)))
      next.categoryId = `Already has a budget for ${formatMonth(validMonth)}`;
    if (!isMonthKey(month)) next.month = "Choose a month";
    if (!(Number(amount) > 0)) next.amount = "Enter an amount greater than 0";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    try {
      await onSubmit({ categoryId: Number(categoryId), month, amount: Number(amount) });
    } catch {
      // Reported by the parent.
    }
  };

  const clear = (field: keyof Errors) => setErrors((e) => ({ ...e, [field]: undefined }));

  return (
    <Card className="max-w-2xl">
      <form onSubmit={handleSubmit} noValidate>
        <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
          <Field
            id="categoryId"
            label="Category"
            required
            error={errors.categoryId}
            className="sm:col-span-2"
          >
            <Select
              id="categoryId"
              disabled={isLoading}
              invalid={!!errors.categoryId}
              value={categoryId}
              onChange={(e) => {
                setCategoryId(e.target.value);
                clear("categoryId");
              }}
            >
              <option value="">{isLoading ? "Loading categories…" : "Select a category"}</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id} disabled={taken.has(c.id)}>
                  {c.name}
                  {taken.has(c.id) ? " — already budgeted" : ""}
                </option>
              ))}
            </Select>
          </Field>
          <Field id="month" label="Month" required error={errors.month}>
            <Input
              id="month"
              type="month"
              invalid={!!errors.month}
              value={month}
              onChange={(e) => {
                setMonth(e.target.value);
                clear("month");
                clear("categoryId");
              }}
            />
          </Field>
          <Field
            id="amount"
            label="Monthly limit"
            required
            error={errors.amount}
            hint={
              categoryId
                ? lastMonthSpend > 0
                  ? `You spent ${formatMoney(lastMonthSpend)} here in ${formatMonth(shiftMonth(validMonth, -1))}.`
                  : `No spending here in ${formatMonth(shiftMonth(validMonth, -1))}.`
                : undefined
            }
          >
            <MoneyInput
              id="amount"
              placeholder="0"
              step="1"
              invalid={!!errors.amount}
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                clear("amount");
              }}
            />
          </Field>
        </div>
        <div className="flex flex-col-reverse gap-2 rounded-b-2xl border-t bg-muted/30 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          <Link to={cancelTo} className={buttonClasses("ghost", "md")}>
            Cancel
          </Link>
          <Button type="submit" loading={submitting}>
            {submitLabel}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default BudgetForm;
