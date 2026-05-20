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

  const { mutate, isPending } = useMutation({
    mutationFn: addCategory,
    onSuccess: () => {
      console.log("category added");
      showSubmitMessage("Category added successfully");
      resetForm();
      queryClient.invalidateQueries({
        queryKey: ["category"],
      });
    },
    onError: () => {
      showSubmitMessage("Opps something went wrong");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      if (!user?.uid) {
        throw new Error("User id is missing");
      }
      mutate({ userId: user.uid, categoryDetail: inputValues });
    } catch (error) {
      showSubmitMessage("Fatal error " + error);
    }
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
