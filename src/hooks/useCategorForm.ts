import { useState } from "react";
import { CategoryFormType, HandleInputChangeType } from "../types/category";

const defaultValues: CategoryFormType = {
  category: "",
  color: "",
};

const useCategoryForm = (initialValues = defaultValues) => {
  const [inputValues, setInputValues] =
    useState<CategoryFormType>(initialValues);

  const handleInputChange = ({ name, inputValue }: HandleInputChangeType) => {
    setInputValues((prevState) => {
      return {
        ...prevState,
        [name]: inputValue,
      };
    });
  };

  const resetForm = () => {
    setInputValues(defaultValues);
  };

  const getCategoryDetail = () => {
    console.log("getCategoryDetail", inputValues);
    return {
      category: inputValues.category,
      color: inputValues.color,
    };
  };

  return {
    handleInputChange,
    inputValues,
    resetForm,
    setInputValues,
    getCategoryDetail,
  };
};
export default useCategoryForm;
