// react hooks
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// tanstack
import { useMutation, useQuery } from "@tanstack/react-query";

// types
import { getExpenseById, updateExpense } from "../../api/expenses";
import { queryClient } from "../../services/firebase";
import ExpenseForm from "../../components/form/Expense";
import Alert from "../../components/ui/Alert";
import useExpenseForm from "../../hooks/useExpenseForm";

const EditExpensePage = () => {
  const {
    inputValues,
    handleInputChange,
    submitMessage,
    setInputValues,
    showSubmitMessage,
    getExpenseDetail,
  } = useExpenseForm();

  const { user } = useAuth();
  const { id } = useParams();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["expenses", id],
    queryFn: () => {
      if (!user?.uid || !id) {
        throw new Error("Missing userid or expenseid");
      }
      return getExpenseById({ uid: user?.uid, id });
    },
    enabled: !!user?.uid && !!id,
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
      showSubmitMessage("Expense updated successfully", "success");
      queryClient.invalidateQueries({
        queryKey: ["users", user?.uid],
      });
    },

    onError: () => {
      console.error("Unable to update expense");
      showSubmitMessage("Unable to update expense", "error");
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

  const handleFormSubmit = (e: React.SubmitEvent) => {
    try {
      e.preventDefault();

      const expenseDetail = getExpenseDetail();

      if (expenseDetail.amount <= 0) {
        console.warn("Please enter amount");
        return;
      }

      if (!id || !user?.uid) {
        return;
      }

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
