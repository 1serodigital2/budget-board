import { useConfirm } from "../../context/ConfirmContext";
import { useToast } from "../../context/ToastContext";
import { useDeleteCategory } from "../../hooks/useCategories";
import type { Category } from "../../types/category";
import { getErrorMessage } from "../../utils/helpers";

/** Confirm, delete and report. Resolves to true when the category was deleted. */
export const useDeleteCategoryAction = () => {
  const confirm = useConfirm();
  const toast = useToast();
  const mutation = useDeleteCategory();

  const run = async (category: Category) => {
    const ok = await confirm({
      title: `Delete “${category.name}”?`,
      description:
        "Its expenses will move to Uncategorized and any budgets set for it will be removed. This can't be undone.",
      confirmLabel: "Delete category",
    });
    if (!ok) return false;
    try {
      await mutation.mutateAsync(category.id);
      toast.success(`“${category.name}” deleted`);
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to delete category"));
      return false;
    }
  };

  return {
    run,
    pendingId: mutation.isPending ? mutation.variables : undefined,
  };
};
