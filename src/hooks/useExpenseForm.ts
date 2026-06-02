// hooks
import { useState } from "react";

import { AlertProps } from "../types/FormTypes";
import { HandleInputChangeType } from "../types/category";
import { ExpenseFormData } from "../types/expense";

const initialValues: ExpenseFormData = {
  amount: 0,
  category: "",
  date: new Date().toISOString().split("T")[0],
  note: "",
};

const useExpenseForm = (defaultValues = initialValues) => {
  const [inputValues, setInputValues] =
    useState<ExpenseFormData>(defaultValues);
  const [submitMessage, setSubmitMessage] = useState<AlertProps>({
    message: "",
  });

  const handleInputChange = ({ name, inputValue }: HandleInputChangeType) => {
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
      date: inputValues.date?.toString() || "",
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
