import { useState } from "react";
import { CategoryFormType } from "../types/category";
import { AlertProps } from "../types/FormTypes";

const defaultValues: CategoryFormType = {
  category: "",
  color: "",
};

const useCategoryForm = (initialValues = defaultValues) => {
  const [inputValues, setInputValues] =
    useState<CategoryFormType>(initialValues);

  const [submitMessage, setSubmitMessage] = useState<AlertProps>({
    message: "",
  });

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

  const showSubmitMessage = (message: string, type?: "success" | "error") => {
    setSubmitMessage({ message: message, type });

    setTimeout(() => {
      setSubmitMessage({ message: "" });
    }, 3000);
  };

  const resetForm = () => {
    setInputValues(defaultValues);
  };

  return {
    handleInputChange,
    inputValues,
    showSubmitMessage,
    resetForm,
    submitMessage,
  };
};
export default useCategoryForm;
