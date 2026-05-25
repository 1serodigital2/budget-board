// react
import { NavLink } from "react-router-dom";

import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteExpense, getExpenses } from "../../api/expenses";
import { queryClient } from "../../services/firebase";
import { useAuth } from "../../context/AuthContext";
import Alert from "../ui/Alert";
import Table from "../ui/Table";
import TableBodyData from "../ui/TableBodyData";
import { getCategories } from "../../api/category";
import useSubmitMessage from "../../hooks/useSubmitMessage";
import Input from "../Input";
import { HandleInputChangeType } from "../../types/category";
import { useState } from "react";
import Submit from "../form/Submit";
import Select from "../form/Select";
import ExpenseFilter from "./expenseFilter";

const ExpenseList = () => {
  const [filter, setFilter] = useState({
    categoryId: "",
    keyword: "",
  });
  const { submitMessage, showSubmitMessage } = useSubmitMessage();
  const { user } = useAuth();
  const userId = user?.uid!;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["expenses"],
    queryFn: () => getExpenses(userId),
    enabled: !!userId,
  });

  const {
    data: catData,
    isError: catIsError,
    error: catError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: () => {
      if (!user?.uid) {
        showSubmitMessage("Unauthorized access", "error");
        return;
      }
      return getCategories(user?.uid);
    },
  });

  console.log("cat data", catData);

  const {
    mutate,
    isPending,
    isError: deleteIsError,
    error: deleteError,
  } = useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => {
      showSubmitMessage("Expense deleted successfully", "success");
      queryClient.invalidateQueries({
        queryKey: ["expenses"],
      });
    },
    onError: () => {
      showSubmitMessage("Unable to delete expense", "error");
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

  if (!data || !catData) {
    return <Alert message="Unable to fetch expenses" />;
  }

  const handleDelete = (expenseId: string) => {
    if (confirm("Are you sure to delete this event") === true) {
      mutate({ uid: userId!, id: expenseId });
    }
  };

  const expensedWithCategory = data.map((expense) => {
    return {
      ...expense,
      categoryData: catData.find((cat) => expense.category === cat.id),
    };
  });

  // console.log("expensedWithCategory", expensedWithCategory);
  
  const handleFilterSubmit = () => {

  }

  return (
    <>
      {!data || data.length === 0 ? (
        <Alert message="Please add expenses" />
      ) : (
        <>
          {submitMessage && submitMessage.message !== "" && (
            <Alert type={submitMessage.type} message={submitMessage.message} />
          )}

          {/* <ExpenseFilter catData={catData} setFilter={setFilter} filter={filter} /> */}
          <Table
            columnNames={[
              "SL No",
              "Category",
              "Amount",
              "Note",
              "Date",
              "Action",
            ]}
            data={data}
          >
            {expensedWithCategory?.map((expense, i) => (
              <tr
                key={expense.id}
                className="bg-neutral-primary border-b border-default"
              >
                <TableBodyData>{i + 1}</TableBodyData>
                <TableBodyData item={expense.categoryData?.name} />
                <TableBodyData item={expense.amount} />
                <TableBodyData item={expense.note} />
                <TableBodyData
                  item={
                    expense.createdAt?.toDate
                      ? expense.createdAt.toDate().toLocaleDateString()
                      : "No date"
                  }
                />
                <TableBodyData>
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
                </TableBodyData>
              </tr>
            ))}
          </Table>
        </>
      )}
    </>
  );
};

export default ExpenseList;
