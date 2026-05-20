import { useState } from "react";
import { CategoryFormType } from "../types/category";

const defaultValues: CategoryFormType = {
  category: "",
  color: "",
};

const useCategoryForm = (initialValues = defaultValues) => {
  const [inputValues, setInputValues] =
    useState<CategoryFormType>(initialValues);

  const handleInputChange = (name: string, inputValue: string | number) => {
    console.log("name ", name);
    console.log("inputValues ", inputValue);
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

  return {
    handleInputChange,
    inputValues,
    resetForm,
  };
};
export default useCategoryForm;
