import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import type { CategoryInput } from "../../types/category";
import { Field, Input } from "../form/Fields";
import Button from "../ui/Button";
import { buttonClasses } from "../ui/buttonClasses";
import Card from "../ui/Card";

interface CategoryFormProps {
  initialValues?: CategoryInput;
  submitLabel: string;
  submitting: boolean;
  onSubmit: (input: CategoryInput) => Promise<void>;
  cancelTo: string;
}

const CategoryForm = ({
  initialValues,
  submitLabel,
  submitting,
  onSubmit,
  cancelTo,
}: CategoryFormProps) => {
  const [name, setName] = useState(initialValues?.name ?? "");
  const [error, setError] = useState<string>();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Give the category a name");
      return;
    }
    try {
      await onSubmit({ name: name.trim() });
    } catch {
      // Reported by the parent.
    }
  };

  return (
    <Card className="max-w-2xl">
      <form onSubmit={handleSubmit} noValidate>
        <div className="p-5 sm:p-6">
          <Field id="name" label="Name" required error={error}>
            <Input
              id="name"
              placeholder="e.g. Groceries"
              autoFocus
              maxLength={40}
              invalid={!!error}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError(undefined);
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

export default CategoryForm;
