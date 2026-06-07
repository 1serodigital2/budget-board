import { useMutation } from "@tanstack/react-query";

import H1 from "../../components/ui/Heading";
import useCategoryForm from "../../hooks/useCategorForm";
import { addCategory } from "../../api/category";
import { queryClient } from "../../services/firebase";
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

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();

    if (!user?.uid) {
      showSubmitMessage("Fatal error " + error);
      return;
    }
    mutate({ userId: user.uid, categoryDetail: inputValues });
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
