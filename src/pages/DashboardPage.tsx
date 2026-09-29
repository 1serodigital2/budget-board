import { useState } from "react";
import CategoryWiseBudget from "../components/budget/CategoryWiseBudget";
import MonthlyExpenseTrend from "../components/dashbaord/MonthlyExpenseTrend";
import SpendingByCategory from "../components/dashbaord/SpendigByCategory";
import useBudget from "../hooks/useBudget";
import useBudgetSummary from "../hooks/useBudgetSummary";
import { useCategories } from "../hooks/useCategories";
import useExpenses from "../hooks/useExpenses";
import { BudgetSummaryCardType } from "../types/dashboard";
import { getCurrentMonth, moneyFormat } from "../utils/helpers";

const date = getCurrentMonth();

const BudgetSummaryCard = ({
  icon,
  iconBg,
  total,
  title,
  footer,
  footerIcon,
  footerColor,
}: {
  icon: string;
  iconBg: string;
  total: number | string;
  title: string;
  footer: string;
  footerIcon?: string;
  footerColor?: string;
}) => {
  return (
    <div className="bg-card border border-border/60 rounded-[14px] p-5 flex flex-col justify-between shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <h5 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">{title}</h5>
        <div className={`w-7 h-7 rounded-md flex justify-center items-center ${iconBg}`}>
          <span className="material-symbols-outlined text-[15px]">{icon}</span>
        </div>
      </div>
      <div>
        <div className={`text-[26px] font-bold tracking-tight mb-2 ${footerColor ? footerColor : "text-foreground"}`}>
          {typeof total === "number" ? moneyFormat(total) : total}
        </div>
        <div className="flex items-center gap-1.5">
          {footerIcon && (
            <span className={`material-symbols-outlined text-[13px] ${footerColor}`}>{footerIcon}</span>
          )}
          <div className="text-[11px] font-medium text-muted-foreground">{footer}</div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { useGetBudgetMonthYear, useGetBudgetTable } = useBudget();
  const { data: budgets } = useGetBudgetMonthYear(date);
  const { useGetExpenseMonthYear } = useExpenses();
  const { data: expenses, isLoading } = useGetExpenseMonthYear(date);

  const { totalExpenses, totalBudget, remainingBudget, budgetPercentageSpent } =
    useBudgetSummary({ budgets, expenses });

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
    return <div className="p-10 text-center text-muted-foreground">Loading dashboard...</div>;
  }

  const isDeficit = remainingBudget < 0;
  const deficitAmount = Math.abs(remainingBudget);

  return (
    <div className="max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8 space-y-6">
      {/* Alert Banner */}
      {isDeficit && (
        <div className="bg-[#1f1618] border border-destructive/20 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive flex items-center justify-center shrink-0 mt-0.5">
              <span className="material-symbols-outlined">warning</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-[14px] text-foreground uppercase">Budget Alert: Over by {moneyFormat(deficitAmount)}</h4>
                <span className="bg-destructive text-[9px] font-bold px-1.5 py-0.5 rounded text-white tracking-wider">DEFICIT</span>
              </div>
              <p className="text-[13px] text-muted-foreground mt-1">
                You've spent <strong className="text-foreground">{budgetPercentageSpent}%</strong> of your monthly limit. Projected month-end overflow is calculated at {moneyFormat(deficitAmount + 141)}.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button className="px-4 py-2 rounded-lg font-semibold text-[13px] text-muted-foreground hover:bg-white/5 transition-colors cursor-pointer">
              Dismiss
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-[13px] bg-primary hover:bg-primary/90 text-primary-foreground transition-colors cursor-pointer shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-[16px]">tune</span>
              Adjust Budget
            </button>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        <BudgetSummaryCard
          title="Total Budget"
          icon="account_balance_wallet"
          iconBg="bg-primary/10 text-primary border border-primary/20"
          footer="Allocated for September 2026"
          footerIcon="check_circle"
          footerColor="text-primary"
          total={totalBudget}
        />
        <BudgetSummaryCard
          title="Total Expenses"
          icon="receipt_long"
          iconBg="bg-warning/10 text-warning border border-warning/20"
          footer="utilized this cycle"
          footerIcon=""
          footerColor="text-foreground"
          total={totalExpenses}
        />
        <BudgetSummaryCard
          title="Remaining Budget"
          icon="trending_down"
          iconBg="bg-destructive/10 text-destructive border border-destructive/20"
          footer="Immediate action suggested"
          footerIcon="warning"
          footerColor={isDeficit ? "text-destructive" : "text-primary"}
          total={(isDeficit ? "-" : "") + moneyFormat(Math.abs(remainingBudget))}
        />
        <BudgetSummaryCard
          title="Spend Velocity"
          icon="speed"
          iconBg="bg-muted-foreground/10 text-muted-foreground border border-border"
          footer="Ceiling breached by 1.8%"
          footerIcon="error"
          footerColor="text-foreground"
          total={`${budgetPercentageSpent}%`}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3 bg-card border border-border/60 rounded-[14px] p-5 md:p-6 shadow-sm">
          <MonthlyExpenseTrend />
        </div>
        <div className="lg:col-span-2 bg-card border border-border/60 rounded-[14px] p-5 md:p-6 shadow-sm">
          <SpendingByCategory />
        </div>
      </div>

      {/* Category Breakdown Table */}
      <div className="bg-card border border-border/60 rounded-[14px] shadow-sm overflow-hidden">
        <CategoryWiseBudget
          budgetData={budgetTable}
          monthFilter={date}
          totalBudgetAmount={totalBudgetAmount}
          totalRemaining={totalRemaining}
          totalSpent={totalSpent}
          showTotal={false}
          hideMonth
        />
      </div>
    </div>
  );
};

export default Dashboard;
