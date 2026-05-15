// react hooks
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// tanstack
import { useMutation, useQuery } from "@tanstack/react-query";

// types
import { ExpenseProps } from "../types/FormTypes";
import { createExpense, getExpenseById, queryClient } from "../api/expenses";
import ExpenseForm from "../components/form/Expense";
import { AlertProps } from "../types/FormTypes";
import Alert from "../components/ui/Alert";

const initialValues: ExpenseProps = {
  amount: 0,
  category: "",
  note: "",
};

const EditExpensePage = () => {
  const { user } = useAuth();
  const params = useParams();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["expenses", params.id],
    queryFn: () => getExpenseById({ uid: user.uid, id: params.id }),
    enabled: !!user.uid && !!params.id
  });

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

  const expenseData: ExpenseProps = {
    amount: data.amount,
    category: data.category,
    note: data.note,
    createdAt: data.createdAt,
  };

  const [inputValues, setInputValues] = useState<ExpenseProps>(expenseData);
  const [submitMessage, setSubmitMessage] = useState<AlertProps>({
    message: "",
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

  if (isLoading) {
    return <Alert message="Loading expense" />;
  }
  if (isError) {
    return (
      <Alert
        type="error"
        message={error.message || "Unable to get expense detail"}
      />
    );
  }

  return (
    <>
      <h1 className="text-2xl font-medium mb-4">Edit Expense</h1>
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

export default EditExpensePage;
