import { useState } from "react";
import { CategoryFormType, HandleInputChangeType } from "../types/category";

const defaultValues: CategoryFormType = {
  name: "",
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
    return {
      name: inputValues.name,
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
