import { useMutation } from "@tanstack/react-query";

import H1 from "../../components/ui/Heading";
import useCategoryForm from "../../hooks/useCategorForm";
import { addCategory } from "../../api/category";
import { queryClient } from "../../services/supabase";
import { useAuth } from "../../context/AuthContext";
import CategoryForm from "../../components/form/Category";
import useSubmitMessage from "../../hooks/useSubmitMessage";

const AddCategoryPage = () => {
  const { inputValues, resetForm, handleInputChange } = useCategoryForm();
  const { showSubmitMessage, submitMessage } = useSubmitMessage();
  const { user } = useAuth();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: addCategory,
    onSuccess: () => {
      showSubmitMessage("Category added successfully", "success");
      resetForm();
      queryClient.invalidateQueries({
        queryKey: ["category"],
      });
    },
    onError: (error: Error) => {
      showSubmitMessage(error.message, "error");
    },
  });

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (!user?.id) {
      showSubmitMessage("Fatal error " + error);
      return;
    }
    mutate({ userId: user.id, categoryDetail: inputValues });
  };

  return (
    <>
      <H1>Add Category</H1>
      <CategoryForm
        isPending={isPending}
        submitMessage={submitMessage}
        handleSubmit={handleSubmit}
        handleInputChange={handleInputChange}
        inputValues={inputValues}
      />
    </>
  );
};

export default AddCategoryPage;
