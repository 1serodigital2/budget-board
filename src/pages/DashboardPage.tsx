import { useState } from "react";
import CategoryWiseBudget from "../components/budget/CategoryWiseBudget";
import MonthlyExpenseTrend from "../components/dashbaord/MonthlyExpenseTrend";
import SpendingByCategory from "../components/dashbaord/SpendigByCategory";
import Alert from "../components/ui/Alert";
import H1 from "../components/ui/Heading";
import useBudget from "../hooks/useBudget";
import useBudgetSummary from "../hooks/useBudgetSummary";
import { useCategories } from "../hooks/useCategories";
import useExpenses from "../hooks/useExpenses";
import { BudgetSummaryCardType } from "../types/dashboard";
import { getCurrentMonth, moneyFormat } from "../utils/helpers";

const date = getCurrentMonth();

const BudgetSummaryCard = ({
  children,
  iconBg,
  total,
  title,
  footer,
  showColor,
  isMobile,
}: BudgetSummaryCardType) => {
  return (
    <div className="border px-2 py-3 md:px-6 md:py-9 rounded-lg bg-white">
      <div className="flex justify-between items-center mb-2 mb:mb-3">
        <h5 className="text-[.7rem] md:text-[.8rem]">{title}</h5>
        <div
          className={`${iconBg} w-7.5 h-7.5 rounded flex justify-center items-center`}
        >
          {children}
        </div>
      </div>
      <div
        className={`text-[1rem] md:text-2xl font-semibold mb-2 text-gray-700 ${showColor && typeof total === "number" && (total < 0 ? "text-red-800" : "text-green-700")}`}
      >
        {typeof total === "number" && moneyFormat(total)}
        {typeof total === "string" && total}
      </div>
      <div className="text-[.6rem] md:text-[.7rem]">{footer}</div>
    </div>
  );
};

const Dashboard = () => {
  const { useGetBudgetMonthYear, useGetBudgetTable } = useBudget();
  const { data: budgets } = useGetBudgetMonthYear(date);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  console.log("[Dashboard] budgets", budgets);

  const { useGetExpenseMonthYear } = useExpenses();
  const { data: expenses, isLoading } = useGetExpenseMonthYear(date);

  const { totalExpenses, totalBudget, remainingBudget, budgetPercentageSpent } =
    useBudgetSummary({
      budgets,
      expenses,
    });

  const { useGetCategories } = useCategories();
  const { data: categories } = useGetCategories();

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

  if (isLoading) {
    return <Alert message="Loading data" />;
  }

  const todaysMonth =
    new Date().toLocaleString("en-US", {
      month: "short",
    }) +
    ", " +
    new Date().getFullYear();

  return (
    <>
      <H1>Budget Summary for {todaysMonth}</H1>
      {/* <div className="text-[.7rem]">An overview of your spending for {todaysMonth}</div> */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 mb:mb-5">
        <BudgetSummaryCard
          title="Total Budget"
          iconBg="bg-blue-300"
          footer="Allocated this month"
          total={totalBudget}
          isMobile
        >
          <span
            className="material-symbols-outlined"
            style={{
              fontVariationSettings: "'wght' 300",
              fontSize: isMobile ? 14 : 20,
              color: "blue",
            }}
          >
            account_balance_wallet
          </span>
        </BudgetSummaryCard>
        <BudgetSummaryCard
          title="Total Expenses"
          iconBg="bg-orange-200"
          footer={`${budgetPercentageSpent}% of budget used`}
          total={totalExpenses}
        >
          <span
            className="material-symbols-outlined"
            style={{
              fontVariationSettings: "'wght' 300",
              fontSize: 20,
              color: "darkorange",
            }}
          >
            finance
          </span>
        </BudgetSummaryCard>
        <BudgetSummaryCard
          title="Remaining Budget"
          iconBg="bg-green-200"
          footer={`${remainingBudget < 0 ? "Control yourself idiot" : "Available to spend"}`}
          total={remainingBudget}
          showColor
        >
          <span
            className="material-symbols-outlined"
            style={{
              fontVariationSettings: "'wght' 300",
              fontSize: 20,
              color: "green",
            }}
          >
            savings
          </span>
        </BudgetSummaryCard>
        <BudgetSummaryCard
          title="Spend Rate"
          iconBg="bg-yellow-100"
          footer={`${parseInt(budgetPercentageSpent) > 100 ? "Over spent" : "On track"}`}
          total={`${budgetPercentageSpent} %`}
        >
          <span
            className="material-symbols-outlined"
            style={{
              fontVariationSettings: "'wght' 300",
              fontSize: 20,
              color: "darkyellow",
            }}
          >
            speed_4
          </span>
        </BudgetSummaryCard>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 md:mt-6 gap-3 mb-3 mb:mb-5">
        <div className="md:col-span-3">
          <MonthlyExpenseTrend />
        </div>
        <div className="md:col-span-2 h-full">
          <SpendingByCategory />
        </div>
      </div>

      <CategoryWiseBudget
        budgetData={budgetTable}
        monthFilter={date}
        totalBudgetAmount={totalBudgetAmount}
        totalRemaining={totalRemaining}
        totalSpent={totalSpent}
        showTotal={false}
        hideMonth
      />
    </>
  );
};

export default Dashboard;
