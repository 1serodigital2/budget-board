// hooks
import { useState } from "react";

import { AlertProps, ExpenseProps } from "../types/FormTypes";

const initialValues: ExpenseProps = {
  amount: 0,
  category: "",
  note: "",
};

const useExpenseForm = (defaultValues = initialValues) => {
  const [inputValues, setInputValues] = useState<ExpenseProps>(defaultValues);
  const [submitMessage, setSubmitMessage] = useState<AlertProps>({
    message: "",
  });

  const handleInputChange = (name: string, inputValue: string | number) => {
    console.log("name ", name);
    console.log("inputValue ", inputValue);
    // if (!name || !inputValue) {
    //   console.error("Please fill up the form properly");
    // }
    setInputValues((prevState) => {
      return {
        ...prevState,
        [name]: inputValue,
      };
    });
  };

  const showSubmitMessage = (message: string, type?: "error" | "success") => {
    setSubmitMessage({ message, type });

    setTimeout(() => {
      setSubmitMessage({ message: "" });
    }, 3000);
  };

  const resetForm = () => {
    setInputValues(defaultValues);
  };

  const getExpenseDetail = () => {
    return {
      amount: Number(inputValues.amount) || 0,
      category: inputValues.category?.toString() || "",
      note: inputValues.note?.toString() || "",
    };
  };

  return {
    inputValues,
    submitMessage,
    handleInputChange,
    resetForm,
    showSubmitMessage,
    getExpenseDetail,
    setInputValues,
  };
};

export default useExpenseForm;
