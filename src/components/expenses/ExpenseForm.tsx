import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useCategories } from "../../hooks/useCategories";
import type { ExpenseInput } from "../../types/expense";
import { todayKey } from "../../utils/helpers";
import { Field, Input, MoneyInput, Select, Textarea } from "../form/Fields";
import Button from "../ui/Button";
import { buttonClasses } from "../ui/buttonClasses";
import Card from "../ui/Card";

interface ExpenseFormProps {
  initialValues?: Partial<ExpenseInput>;
  submitLabel: string;
  submitting: boolean;
  /** Should throw on failure so the form keeps the user's input. */
  onSubmit: (input: ExpenseInput, options: { addAnother: boolean }) => Promise<void>;
  cancelTo: string;
  allowAddAnother?: boolean;
}

interface FormState {
  amount: string;
  categoryId: string;
  date: string;
  note: string;
}

type Errors = Partial<Record<keyof FormState, string>>;

const validate = (values: FormState): Errors => {
  const errors: Errors = {};
  if (!(Number(values.amount) > 0)) errors.amount = "Enter an amount greater than 0";
  if (!values.categoryId) errors.categoryId = "Choose a category";
  if (!values.date) errors.date = "Choose a date";
  else if (values.date > todayKey()) errors.date = "Date can't be in the future";
  return errors;
};

const ExpenseForm = ({
  initialValues,
  submitLabel,
  submitting,
  onSubmit,
  cancelTo,
  allowAddAnother = false,
}: ExpenseFormProps) => {
  const { data: categories = [], isLoading: loadingCategories } = useCategories();
  const [values, setValues] = useState<FormState>({
    amount: initialValues?.amount ? String(initialValues.amount) : "",
    categoryId: initialValues?.categoryId ? String(initialValues.categoryId) : "",
    date: initialValues?.date ?? todayKey(),
    note: initialValues?.note ?? "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitMode, setSubmitMode] = useState<"save" | "another">("save");

  const set = (field: keyof FormState) => (value: string) => {
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const addAnother =
      (e.nativeEvent as SubmitEvent).submitter?.getAttribute("value") === "another";
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitMode(addAnother ? "another" : "save");
    try {
      await onSubmit(
        {
          amount: Number(values.amount),
          categoryId: Number(values.categoryId),
          date: values.date,
          note: values.note.trim(),
        },
        { addAnother },
      );
      if (addAnother) {
        // Keep category and date: people usually log several similar expenses.
        setValues((v) => ({ ...v, amount: "", note: "" }));
        document.getElementById("amount")?.focus();
      }
    } catch {
      // The parent reports the error; keep the input so nothing is lost.
    }
  };

  return (
    <Card className="max-w-2xl">
      <form onSubmit={handleSubmit} noValidate>
        <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
          <Field id="amount" label="Amount" required error={errors.amount}>
            <MoneyInput
              id="amount"
              placeholder="0.00"
              autoFocus
              invalid={!!errors.amount}
              value={values.amount}
              onChange={(e) => set("amount")(e.target.value)}
            />
          </Field>
          <Field id="date" label="Date" required error={errors.date}>
            <Input
              id="date"
              type="date"
              max={todayKey()}
              invalid={!!errors.date}
              value={values.date}
              onChange={(e) => set("date")(e.target.value)}
            />
          </Field>
          <Field
            id="categoryId"
            label="Category"
            required
            error={errors.categoryId}
            className="sm:col-span-2"
            hint={
              <>
                Need another?{" "}
                <Link to="/categories/new" className="font-medium text-primary hover:underline">
                  Create a category
                </Link>
              </>
            }
          >
            <Select
              id="categoryId"
              disabled={loadingCategories}
              invalid={!!errors.categoryId}
              value={values.categoryId}
              onChange={(e) => set("categoryId")(e.target.value)}
            >
              <option value="">
                {loadingCategories ? "Loading categories…" : "Select a category"}
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field id="note" label="Note" className="sm:col-span-2" hint="Optional — e.g. “Dinner with friends”">
            <Textarea
              id="note"
              rows={2}
              maxLength={200}
              value={values.note}
              onChange={(e) => set("note")(e.target.value)}
            />
          </Field>
        </div>
        <div className="flex flex-col-reverse gap-2 border-t bg-muted/30 px-5 py-4 sm:flex-row sm:justify-end sm:px-6 rounded-b-2xl">
          <Link to={cancelTo} className={buttonClasses("ghost", "md")}>
            Cancel
          </Link>
          {allowAddAnother && (
            <Button
              type="submit"
              value="another"
              variant="secondary"
              loading={submitting && submitMode === "another"}
              disabled={submitting}
            >
              Save & add another
            </Button>
          )}
          <Button
            type="submit"
            value="save"
            loading={submitting && submitMode === "save"}
            disabled={submitting}
          >
            {submitLabel}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ExpenseForm;
