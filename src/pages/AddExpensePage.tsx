// react hooks
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

// tanstack
import { useMutation } from "@tanstack/react-query";

import Input from "../components/Input";

// types
import { ExpenseProps } from "../types/FormTypes";
import { createExpense, queryClient } from "../api/expenses";
import ExpenseForm from "../components/form/Expense";
import { AlertProps } from "../types/FormTypes";

const initialValues: ExpenseProps = {
  amount: 0,
  category: "",
  note: "",
};

const AddExpense = () => {
  const [inputValues, setInputValues] = useState(initialValues);
  const [submitMessage, setSubmitMessage] = useState<AlertProps>({
    message: "",
  });

  const { user } = useAuth();

  const { mutate, isPending } = useMutation({
    mutationFn: createExpense,
    onSuccess: () => {
      setInputValues(initialValues);
      setSubmitMessage({ message: "Expense added successfully" });
      queryClient.invalidateQueries({
        queryKey: ["users"],
        refetchType: "none",
      });

      setTimeout(() => {
        setSubmitMessage({ message: "" });
      }, 3000);
    },

    onError: () => {
      console.error("Unable to add expense");

      setSubmitMessage({ type: "error", message: "Unable to add expense" });

      setTimeout(() => {
        setSubmitMessage({ message: "" });
      }, 3000);
    },
  });

  const handleInputChange = (name: string, inputValue: string | number) => {
    console.log("name ", name);
    console.log("inputValue ", inputValue);
    if (!name || !inputValue) {
      console.error("Please fill up the form properly");
    }
    setInputValues((prevState) => {
      return {
        ...prevState,
        [name]: inputValue,
      };
    });
  };

  const handleFormSubmit = (e: React.SubmitEvent) => {
    try {
      e.preventDefault();

      const amount = inputValues.amount || 0;
      const category = inputValues.category?.toString() || "";
      const note = inputValues.note?.toString() || "";

      if (amount <= 0) {
        console.warn("Please enter amount");
        return;
      }
      const expenseDetail = {
        amount,
        category,
        note,
      };

      mutate({ uid: user.uid, expenseDetail });
    } catch (error) {
      console.error("Unable to add", error);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-medium mb-4">Add Expense</h1>
      <ExpenseForm
        handleFormSubmit={handleFormSubmit}
        handleInputChange={handleInputChange}
        inputValues={inputValues}
        isPending={isPending}
        submitMessage={submitMessage}
      />
    </>
  );
};

export default AddExpense;
