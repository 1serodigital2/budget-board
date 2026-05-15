// react
import { useState } from "react";

import { NavLink } from "react-router-dom";

import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteExpense, getExpenses, queryClient } from "../../api/expenses";
import { useAuth } from "../../context/AuthContext";
import Alert from "../ui/Alert";

const ExpenseList = () => {
  const [deleteMessage, setDeleteMessage] = useState<AlertProps>({
    message: "",
  });
  const { user } = useAuth();
  const userId = user.uid;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["expenses"],
    queryFn: () => getExpenses(userId),
    enabled: !!userId,
  });

  const {
    mutate,
    isPending,
    isError: deleteIsError,
    error: deleteError,
  } = useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => {
      setDeleteMessage({
        type: "success",
        message: "Expense deleted successfully",
      });
      queryClient.invalidateQueries({
        queryKey: ["expenses"],
      });

      setTimeout(() => {
        setDeleteMessage({ message: "" });
      }, 3000);
    },
    onError: () => {
      setDeleteMessage({ type: "error", message: "Unable to delete expense" });
      setTimeout(() => {
        setDeleteMessage({ message: "" });
      }, 3000);
    },
  });

  if (isLoading) {
    return <Alert message="Loading Expenses..." />;
  }

  if (isError) {
    return (
      <Alert
        type="error"
        message={error.message || "Unable to fetch expenses"}
      />
    );
  }

  const handleDelete = (expenseId) => {
    if (confirm("Are you sure to delete this event") === true) {
      mutate({ uid: userId, id: expenseId });
    }
  };

  return (
    <>
      {deleteMessage && deleteMessage.message !== "" && (
        <Alert type={deleteMessage.type} message={deleteMessage.message} />
      )}
      <div className="relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base border border-default rounded">
        <table className="w-full text-sm text-left rtl:text-right text-body">
          <thead className="text-sm text-body bg-neutral-secondary-soft border-b rounded-base border-default rounded">
            <tr>
              <th className="px-6 py-3 font-medium">SL No</th>
              <th className="px-6 py-3 font-medium">Category</th>
              <th className="px-6 py-3 font-medium">Amount</th>
              <th className="px-6 py-3 font-medium">Note</th>
              <th className="px-6 py-3 font-medium">Date</th>
              <th className="px-6 py-3 font-medium">Action</th>
            </tr>
          </thead>

          <tbody>
            {data?.map((expense, i) => (
              <tr
                key={expense.id}
                className="bg-neutral-primary border-b border-default"
              >
                <td className="px-6 py-4">{i + 1}</td>
                <td className="px-6 py-4">{expense.category}</td>
                <td className="px-6 py-4">{expense.amount}</td>
                <td className="px-6 py-4">{expense.note}</td>
                <td className="px-6 py-4">
                  {expense.createdAt?.toDate
                    ? expense.createdAt.toDate().toLocaleDateString()
                    : "No date"}
                </td>

                <td className="px-6 py-4">
                  <NavLink
                    to={expense.id}
                    className="cursor-pointer btn-primary mr-4 text-green-700"
                  >
                    View
                  </NavLink>

                  <NavLink
                    to={`${expense.id}/edit`}
                    className="cursor-pointer btn-primary mr-4 text-blue-600"
                  >
                    Edit
                  </NavLink>

                  <button
                    disabled={isPending}
                    onClick={() => handleDelete(expense.id)}
                    className="cursor-pointer text-red-900 disabled:opacity-50"
                  >
                    {isPending ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ExpenseList;
