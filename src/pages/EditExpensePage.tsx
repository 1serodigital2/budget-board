// react hooks
import { useEffect, useState } from "react";
import { useParams, useLoaderData } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// tanstack
import { useMutation, useQuery } from "@tanstack/react-query";

// types
import { ExpenseProps } from "../types/FormTypes";
import {
  createExpense,
  getExpenseById,
  queryClient,
  updateExpense,
} from "../api/expenses";
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
  const { id } = useParams();
  const [inputValues, setInputValues] = useState<ExpenseProps>(initialValues);
  const [submitMessage, setSubmitMessage] = useState<AlertProps>({
    message: "",
  });

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["expenses", id],
    queryFn: () => getExpenseById({ uid: user.uid, id }),
    enabled: !!user.uid && !!id,
  });

  useEffect(() => {
    if (data) {
      setInputValues({
        amount: data.amount || "",
        category: data.category || "",
        note: data.note || "",
        createdAt: data.createdAt || "",
      });
    }
  }, [data]);

  const { mutate, isPending } = useMutation({
    mutationFn: updateExpense,
    onSuccess: () => {
      setSubmitMessage({ message: "Expense updated successfully" });
      queryClient.invalidateQueries({
        queryKey: ["users", user.uid],
      });

      setTimeout(() => {
        setSubmitMessage({ message: "" });
      }, 3000);
    },

    onError: () => {
      console.error("Unable to update expense");

      setSubmitMessage({ type: "error", message: "Unable to update expense" });

      setTimeout(() => {
        setSubmitMessage({ message: "" });
      }, 3000);
    },
  });

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

  const handleInputChange = (name: string, inputValue: string | number) => {
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

      mutate({ expId: id, expenseDetail, uid: user.uid });
    } catch (error) {
      console.error("Unable to add", error);
    }
  };

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

// export const loader = async ({ request, params }) => {
//   console.log("loader triggered");
//   try {
//     const { user } = useAuth();
//     const response = await getExpenseById({ uid: user.id, id: request.id });
//     return response;
//   } catch (error: any) {
//     throw new Error("error while loading expense", error);
//   }
// };
