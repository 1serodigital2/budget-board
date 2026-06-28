import { useEffect, useState } from "react";

import Alert from "../../components/ui/Alert";
import H1 from "../../components/ui/Heading";
import Table from "../../components/ui/Table";
import TableBodyData from "../../components/ui/TableBodyData";
import useBudget from "../../hooks/useBudget";
import { useCategories } from "../../hooks/useCategories";
import useExpenses from "../../hooks/useExpenses";
import { getCurrentMonth, moneyFormat } from "../../utils/helpers";
import Input from "../../components/Input";
import { HandleInputChangeType } from "../../types/category";
import Submit from "../../components/form/Submit";
import useSubmitMessage from "../../hooks/useSubmitMessage";
import { NavLink } from "react-router-dom";
import CategoryWiseBudget from "../../components/budget/CategoryWiseBudget";
import MyForm from "../../components/form/Form";

const currentMntYr = getCurrentMonth();

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
  } = useGetExpenseMonthYear(monthFilter + "-01");

  console.log("[BudgetOverview] Debug budgets", budgets);

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

  const handleFormSubmit = (e: React.SyntheticEvent) => {
    try {
      e.preventDefault();
      const date = inputValue.budgetMonth.toString();
      console.log("[BudgetOverview] handleFormSubmit date", date);

      setMonthFilter(date);
    } catch (error) {}
  };

  return (
    <>
      <H1>Budget overview</H1>
      <MyForm onSubmit={handleFormSubmit}>
        <Input
          type="month"
          name="budgetMonth"
          handleInputChange={handleInputChange}
          sx="border"
          inputValues={inputValue.budgetMonth}
        />
        <Submit />
      </MyForm>

      {submitMessage && submitMessage.message !== "" && (
        <Alert type={submitMessage.type} message={submitMessage.message} />
      )}

      <CategoryWiseBudget
        budgetData={budgetTable}
        monthFilter={monthFilter}
        totalBudgetAmount={totalBudgetAmount}
        totalRemaining={totalRemaining}
        totalSpent={totalSpent}
      />
    </>
  );
};

export default BudgetOverview;
