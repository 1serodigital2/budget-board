import { useNavigate } from "react-router-dom";
import CategoryForm from "../../components/categories/CategoryForm";
import PageHeader from "../../components/ui/PageHeader";
import { useToast } from "../../context/ToastContext";
import { useCreateCategory } from "../../hooks/useCategories";
import { getErrorMessage } from "../../utils/helpers";

const AddCategoryPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const createCategory = useCreateCategory();

  return (
    <>
      <PageHeader
        back={{ to: "/categories", label: "Categories" }}
        title="New category"
        description="Categories group your expenses and budgets."
      />
      <CategoryForm
        submitLabel="Create category"
        submitting={createCategory.isPending}
        cancelTo="/categories"
        onSubmit={async (input) => {
          try {
            await createCategory.mutateAsync(input);
          } catch (error) {
            toast.error(getErrorMessage(error, "Unable to create category"));
            throw error;
          }
          toast.success(`“${input.name}” created`);
          navigate("/categories");
        }}
      />
    </>
  );
};

export default AddCategoryPage;
