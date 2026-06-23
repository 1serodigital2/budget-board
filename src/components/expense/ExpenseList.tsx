// react
import { NavLink, useSearchParams } from "react-router-dom";

import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteExpense, getExpenses } from "../../api/expenses";
import { queryClient } from "../../services/firebase";
import { useAuth } from "../../context/AuthContext";
import Alert from "../ui/Alert";
import Table from "../ui/Table";
import TableBodyData from "../ui/TableBodyData";
import { getCategories } from "../../api/category";
import useSubmitMessage from "../../hooks/useSubmitMessage";
import { HandleInputChangeType } from "../../types/category";
import { useEffect, useState } from "react";
import ExpenseFilter from "./ExpenseFilter";
import {
  DateRange,
  ExpenseProps,
  ExpensesDetailTyps,
  FilterProps,
} from "../../types/expense";
import {
  formatDate,
  getTimeStampFromMonth,
  moneyFormat,
} from "../../utils/helpers";
import useExpenses from "../../hooks/useExpenses";
import MyButton from "../form/MyButton";

const ExpenseList = () => {
  const [searchParams] = useSearchParams();
  const month = searchParams.get("month") || "";
  const category = searchParams.get("category") || "";
  const initialDateRange: DateRange = month
    ? (() => {
        const { startDate, endDate } = getTimeStampFromMonth(month);
        return { start: startDate, end: endDate };
      })()
    : { start: null, end: null };

  const initialFilter = {
    category: "",
    dateRange: initialDateRange,
  };
  const [filter, setFilter] = useState<FilterProps>(initialFilter);
  const [appliedFilter, setAppliedFilter] =
    useState<FilterProps>(initialFilter);

  const { submitMessage, showSubmitMessage } = useSubmitMessage();
  const { user } = useAuth();
  const userId = user?.uid!;

  const { useGetExpensesQuery } = useExpenses();

  const {
    data: expensesData,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetExpensesQuery({
    category: appliedFilter.category,
    dateRange: appliedFilter.dateRange,
  });

  const expenses = expensesData?.pages.flatMap((page) => page.expenses) ?? [];

  console.log("expense data1", expensesData);

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

  useEffect(() => {
    if (!category || !catData) return;

    const searchCatId = catData.find((cat) => cat.slug === category)?.id;

    setFilter((prev) => ({
      ...prev,
      category: searchCatId ?? "",
    }));

    setAppliedFilter((prev) => ({
      ...prev,
      category: searchCatId ?? "",
    }));
  }, [category, catData]);

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

  if (!expensesData?.pages || !catData || expensesData?.pages?.length <= 0) {
    return <Alert message="Unable to fetch expenses" type="error" />;
  }

  const handleDelete = (expenseId: string) => {
    if (confirm("Are you sure to delete this event") === true) {
      mutate({ uid: userId!, id: expenseId });
    }
  };

  const expensedWithCategory = expenses.map((expense) => {
    return {
      ...expense,
      categoryData: catData.find((cat) => expense.category === cat.id),
    };
  });

  const handleInputChange = ({ name, inputValue }: HandleInputChangeType) => {
    setFilter((prevState) => {
      return {
        ...prevState,
        [name]: inputValue,
      };
    });
  };

  console.log("filter", filter);

  const handleFilterSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!filter.category && !filter.dateRange) {
      showSubmitMessage("Please select category or enter search keyword");
    }
    setAppliedFilter(filter);
  };

  const handleFilterReset = () => {
    setAppliedFilter(initialFilter);
    setFilter(initialFilter);
  };

  return (
    <>
      <ExpenseFilter
        catData={catData}
        handleInputChange={handleInputChange}
        handleFilterSubmit={handleFilterSubmit}
        handleFilterReset={handleFilterReset}
        filter={filter}
        isPending={isLoading}
      />
      {!expenses || expenses.length === 0 ? (
        <Alert message="Data not found" />
      ) : (
        <>
          {submitMessage && submitMessage.message !== "" && (
            <Alert type={submitMessage.type} message={submitMessage.message} />
          )}
          <div className="bg-white rounded-lg border p-4">
            <Table
              columnNames={[
                "SL No",
                "Category",
                "Amount",
                "Note",
                "Date",
                "Action",
              ]}
              data={expenses}
            >
              {expensedWithCategory?.map((expense, i) => (
                <tr
                  key={expense.id}
                  className={`bg-neutral-primary ${expensedWithCategory.length - 1 !== i ? "border-b border-default" : ""}`}
                >
                  <TableBodyData>{i + 1}</TableBodyData>
                  <TableBodyData item={expense.categoryData?.name} />
                  <TableBodyData>{moneyFormat(expense.amount)}</TableBodyData>
                  <TableBodyData item={expense.note} />
                  <TableBodyData
                    item={
                      expense.date?.toDate
                        ? formatDate(expense.date.toDate())
                        : expense.createdAt?.toDate
                          ? formatDate(expense.createdAt.toDate())
                          : ""
                    }
                  />
                  <TableBodyData>
                    <div className="flex gap-1 items-center">
                      <MyButton btnType="view" btnSlug={expense.id} />
                      <MyButton btnType="edit" btnSlug={`${expense.id}/edit`} />
                      <MyButton
                        btnType="delete"
                        deleteFn={handleDelete}
                        id={expense.id}
                        isPending={isPending}
                      />
                    </div>
                  </TableBodyData>
                </tr>
              ))}
            </Table>
          </div>
          {hasNextPage && (
            <div className="text-center">
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="bg-(--color-primary) py-2 px-4 h-11.5 text-white rounded-xl cursor-pointer mt-3"
              >
                {isFetchingNextPage ? "Loading..." : "Load more"}
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default ExpenseList;
