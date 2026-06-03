import { useEffect, useState } from "react";

import Alert from "../../components/ui/Alert";
import H1 from "../../components/ui/Heading";
import Table from "../../components/ui/Table";
import TableBodyData from "../../components/ui/TableBodyData";
import useBudget from "../../hooks/useBudget";
import { useCategories } from "../../hooks/useCategories";
import useExpenses from "../../hooks/useExpenses";
import { getMonthYear } from "../../utils/helpers";
import Input from "../../components/Input";
import { HandleInputChangeType } from "../../types/category";
import Submit from "../../components/form/Submit";
import useSubmitMessage from "../../hooks/useSubmitMessage";
import { BudgetTableResponseTypes } from "../../types/budget";

const currentMntYr = getMonthYear();

const BudgetOverview = () => {
  const [monthFilter, setMonthFilter] = useState(currentMntYr);
  const [inputValue, setInputValue] = useState({ budgetMonth: monthFilter });
  const { useGetBudgetMonthYear, useGetBudgetTable } = useBudget();

  const { showSubmitMessage, submitMessage } = useSubmitMessage();

  const { data: budgets } = useGetBudgetMonthYear(monthFilter);

  const { useCategoriesQuery } = useCategories();
  const { data: categories } = useCategoriesQuery();

  const { useGetExpenseMonthYear } = useExpenses();
  const {
    data: expenses,
    isError: expensesIsError,
    error: expensesError,
  } = useGetExpenseMonthYear(monthFilter);

  const {
    budgetData: budgetTable,
    totalSpent,
    totalBudgetAmount,
    totalRemaining,
  } = useGetBudgetTable({
    budgets: budgets || [],
    expenses: expenses || [],
    categories: categories || [],
  }) ?? {
    budgetData: [],
    totalSpent: 0,
    totalBudgetAmount: 0,
    totalRemaining: 0,
  };

  console.log("budgetTable", budgetTable);
  console.log("totalSpent", totalSpent);
  console.log("totalBudgetAmount", totalBudgetAmount);

  if (expensesIsError) {
    return (
      <Alert
        type="error"
        message={expensesError.message || "Unablet to fetche expenses"}
      />
    );
  }

  const handleInputChange = ({ name, inputValue }: HandleInputChangeType) => {
    setInputValue((prevState) => {
      return {
        ...prevState,
        [name]: inputValue,
      };
    });
  };

  const handleFormSubmit = (e: React.SubmitEvent) => {
    try {
      e.preventDefault();
      const date = inputValue.budgetMonth.toString();
      setMonthFilter(date);
    } catch (error) {}
  };

  return (
    <>
      <H1>Budget overview</H1>

      <form
        onSubmit={handleFormSubmit}
        className="flex items-center gap-3 max-w-md"
      >
        <Input
          type="month"
          name="budgetMonth"
          handleInputChange={handleInputChange}
          sx="border"
          inputValues={inputValue.budgetMonth}
        />
        <Submit />
      </form>

      {submitMessage && submitMessage.message !== "" && (
        <Alert type={submitMessage.type} message={submitMessage.message} />
      )}

      {!budgetTable ? (
        <Alert message="Data not found" />
      ) : (
        <Table
          columnNames={[
            "Sl No",
            "Category",
            "Budget",
            "Spent",
            "Spent Percentage",
            "Remaining",
            "Month",
          ]}
        >
          {budgetTable.map((budget, i) => (
            <tr className="bg-neutral-primary border-b border-default">
              <TableBodyData>{i + 1}</TableBodyData>
              <TableBodyData item={budget.categoryName} />
              <TableBodyData>{budget.budget}</TableBodyData>
              <TableBodyData>{budget.spent}</TableBodyData>
              <TableBodyData>{budget.percentage}</TableBodyData>
              <TableBodyData>{budget.remaining}</TableBodyData>
              <TableBodyData>{budget.budgetMonth}</TableBodyData>
            </tr>
          ))}
          <tr className="bg-neutral-primary border-b border-default">
            <TableBodyData colSpan={2}>Total</TableBodyData>
            <TableBodyData>{totalBudgetAmount}</TableBodyData>
            <TableBodyData>{totalSpent}</TableBodyData>
            <TableBodyData></TableBodyData>
            <TableBodyData>{totalRemaining}</TableBodyData>
          </tr>
        </Table>
      )}
    </>
  );
};

export default BudgetOverview;
