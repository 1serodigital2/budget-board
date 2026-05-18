import { useMutation } from "@tanstack/react-query";

import Submit from "../../components/form/Submit";
import Input from "../../components/Input";
import H1 from "../../components/ui/Heading";
import useCategoryForm from "../../hooks/useCategorForm";
import { addCategory } from "../../api/category";
import { queryClient } from "../../services/firebase";
import { useAuth } from "../../context/AuthContext";
import Alert from "../../components/ui/Alert";

const AddCategoryPage = () => {
  const {
    handleInputChange,
    inputValues,
    showSubmitMessage,
    resetForm,
    submitMessage,
  } = useCategoryForm();
  const { user } = useAuth();

  const { mutate, isPending } = useMutation({
    mutationFn: addCategory,
    onSuccess: () => {
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
      mutate({ userId: user.uid, categoryDetail: inputValues });
    } catch (error) {}
  };

  return (
    <>
      <H1>Add Category</H1>
      {isPending && (
        <Alert message={submitMessage.message} type={submitMessage.type} />
      )}
      <form
        onSubmit={handleSubmit}
        className="bg-(--color-primary) p-8 rounded-3xl max-w-3xl"
      >
        <div className="mb-2">
          <Input
            name="category"
            label="Category"
            handleInputChange={handleInputChange}
            inputValues={inputValues.category || ""}
          />
        </div>
        <div className="flex justify-between">
          <div className="mb-2 flex-1">
            <Input
              type="color"
              name="color"
              label="Color"
              sx="p-0 h-20 w-20"
              handleInputChange={handleInputChange}
              inputValues={inputValues.color || ""}
            />
          </div>
          {/* <div className="mb-2 flex-1">
            <Input name="icon" label="Icon" />
          </div> */}
        </div>
        <Submit isPending={isPending} />
      </form>
    </>
  );
};

export default AddCategoryPage;
