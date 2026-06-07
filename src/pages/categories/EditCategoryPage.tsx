import { useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";

import Category from "../../components/form/Category";
import H1 from "../../components/ui/Heading";
import useCategoryForm from "../../hooks/useCategorForm";
import useSubmitMessage from "../../hooks/useSubmitMessage";
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";
import { getCategoryById, updateCategory } from "../../api/category";
import Alert from "../../components/ui/Alert";
import { queryClient } from "../../services/firebase";

const EditCategoryPage = () => {
  const params = useParams();
  const { user } = useAuth();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["categories", params.id],
    queryFn: () => {
      if (!user?.uid || !params?.id) {
        showSubmitMessage("Unauthorized access", "error");
        return;
      }
      return getCategoryById({ userId: user?.uid, categoryId: params.id });
    },
    enabled: !!user?.uid,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      showSubmitMessage("Category updated successfully", "success");
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
  });
  const { showSubmitMessage, submitMessage } = useSubmitMessage();
  const { inputValues, handleInputChange, setInputValues, getCategoryDetail } =
    useCategoryForm();

  useEffect(() => {
    if (data) {
      const catData = {
        category: data.category,
        color: data.color,
      };
      setInputValues(catData);
    }
  }, [data]);

  if (isLoading) {
    return <Alert message="loading category detail" />;
  }

  if (isError) {
    return (
      <Alert
        type="error"
        message={error.message || "Unable to get category detail"}
      />
    );
  }

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    try {
      const categoryDetail = getCategoryDetail();
      console.log("categoryDetail", categoryDetail);
      if (
        !categoryDetail.category ||
        !categoryDetail.color ||
        !params.id ||
        !user?.uid
      ) {
        showSubmitMessage("Please fill up the form properly", "error");
        return;
      }
      mutate({ userId: user?.uid, catId: params.id, categoryDetail });
    } catch (error) {}
  };
  return (
    <>
      <H1>Edit Category</H1>
      <Category
        submitMessage={submitMessage}
        inputValues={inputValues}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isPending={isPending}
      />
    </>
  );
};

export default EditCategoryPage;
