import { useNavigate, useParams } from "react-router-dom";
import CategoryForm from "../../components/categories/CategoryForm";
import { ButtonLink } from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import PageHeader from "../../components/ui/PageHeader";
import { PageLoader } from "../../components/ui/Spinner";
import { EmptyState, ErrorState } from "../../components/ui/States";
import { useToast } from "../../context/ToastContext";
import { useCategory, useUpdateCategory } from "../../hooks/useCategories";
import { getErrorMessage } from "../../utils/helpers";

const EditCategoryPage = () => {
  const id = Number(useParams().id);
  const navigate = useNavigate();
  const toast = useToast();
  const { data: category, isPending, isError, error, refetch } = useCategory(id);
  const updateCategory = useUpdateCategory(id);

  const back = { to: `/categories/${id}`, label: "Category" };

  if (isPending) return <PageLoader label="Loading category…" />;
  if (isError) {
    return (
      <>
        <PageHeader back={{ to: "/categories", label: "Categories" }} title="Edit category" />
        <Card>
          <ErrorState error={error} onRetry={() => refetch()} />
        </Card>
      </>
    );
  }

  if (category.isSystem) {
    return (
      <>
        <PageHeader back={back} title="Edit category" />
        <Card className="max-w-2xl">
          <EmptyState
            icon="lock"
            title="This category can't be edited"
            description="Uncategorized is a system category used for expenses whose category was deleted."
            action={
              <ButtonLink to="/categories" variant="secondary">
                Back to categories
              </ButtonLink>
            }
          />
        </Card>
      </>
    );
  }

  return (
    <>
      <PageHeader back={back} title="Edit category" description={category.name} />
      <CategoryForm
        key={category.id}
        initialValues={{ name: category.name }}
        submitLabel="Save changes"
        submitting={updateCategory.isPending}
        cancelTo={back.to}
        onSubmit={async (input) => {
          try {
            await updateCategory.mutateAsync(input);
          } catch (err) {
            toast.error(getErrorMessage(err, "Unable to update category"));
            throw err;
          }
          toast.success("Category updated");
          navigate(back.to);
        }}
      />
    </>
  );
};

export default EditCategoryPage;
