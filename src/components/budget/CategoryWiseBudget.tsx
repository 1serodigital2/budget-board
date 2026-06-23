import { NavLink } from "react-router-dom";

import Alert from "../ui/Alert";
import Table from "../ui/Table";
import TableBodyData from "../ui/TableBodyData";

import { moneyFormat } from "../../utils/helpers";
import { BudgetTableProps, BudgetTableTypes } from "../../types/budget";
import MyButton from "../form/MyButton";

const CategoryWiseBudget = ({
  budgetData,
  monthFilter,
  totalRemaining,
  totalBudgetAmount,
  totalSpent,
  showTotal = true,
  hideMonth = false,
}: BudgetTableProps) => {
  if (!budgetData) {
    return <Alert message="Data not found" />;
  }

  const columns = [
    "Category",
    "Budget",
    "Spent",
    "Remaining",
    "Spent Percentage",
    "Status",
    "Action",
  ];

  if (!hideMonth) {
    columns.splice(columns.length - 2, 0, "Month");
  }

  const bgColor = (percentage: number) => {
    return percentage > 100
      ? "bg-red-600"
      : percentage >= 80
        ? "bg-yellow-500"
        : "bg-green-500";
  };

  const hasMonthColumn = columns.includes("Month");

  return (
    <div className="mb-5 bg-white rounded-lg border p-4">
      <h2 className="text-[.9rem] font-medium mb-1">Category Breakdown</h2>
      <div className="mb-3 text-[.8rem] text-gray-500">
        {budgetData?.length} categories tracked this month
      </div>
      <Table columnNames={columns}>
        {budgetData.map((budget, i) => (
          <tr
            className={`bg-neutral-primary ${i !== budgetData.length - 1 ? "border-b border-default" : ""}  hover:bg-blue-50 transition duration-200`}
          >
            <TableBodyData item={budget.categoryName} />
            <TableBodyData>{moneyFormat(budget.budget)}</TableBodyData>
            <TableBodyData>{moneyFormat(budget.spent)}</TableBodyData>
            <TableBodyData>
              <div className={`${budget.remaining < 0 ? "text-red-700" : ""}`}>
                {moneyFormat(budget.remaining)}
              </div>
            </TableBodyData>
            <TableBodyData>
              <div className="flex gap-[.4rem] items-center">
                <div className="w-36 rounded h-1.25 bg-gray-100 overflow-hidden">
                  <div
                    className={`${bgColor(budget.percentage)}`}
                    style={{
                      width: `${Math.min(budget.percentage, 100)}%`,
                      height: "100%",
                    }}
                  ></div>
                </div>
                {budget.percentage}%
              </div>
            </TableBodyData>
            {hasMonthColumn && (
              <TableBodyData>{budget.budgetMonth}</TableBodyData>
            )}
            <TableBodyData>
              {budget.percentage > 100 ? (
                <div className="bg-red-100 text-red-700 py-[.1rem] px-2 rounded-full max-w-max text-[.7rem]">
                  Over Budget
                </div>
              ) : budget.percentage > 80 ? (
                <div className="bg-yellow-100 text-yellow-800 py-[.1rem] px-2 rounded-full max-w-max text-[.7rem]">
                  Near Budget
                </div>
              ) : (
                <div className="bg-green-100 text-green-700 py-[.1rem] px-2 rounded-full max-w-max text-[.7rem]">
                  On Track
                </div>
              )}
            </TableBodyData>

            <TableBodyData>
              {budget.spent > 0 && (
                <MyButton btnSlug={`/expenses?month=${monthFilter}&category=${budget.categorySlug}`} btnType="view" />
                // <NavLink
                //   to={`/expenses?month=${monthFilter}&category=${budget.categorySlug}`}
                //   className="bg-blue-100 rounded px-2 py-[.1rem] cursor-pointer hover:bg-blue-600 transition duration-200 hover:text-white flex gap-1 items-center text-[.7rem]"
                // >
                //   <span
                //     className="material-symbols-outlined"
                //     style={{
                //       fontSize: ".8rem",
                //     }}
                //   >
                //     visibility
                //   </span>
                //   <span>View</span>
                // </NavLink>
              )}
            </TableBodyData>
          </tr>
        ))}
        {showTotal && (
          <tr className="bg-neutral-primary border-t border-default font-semibold hover:bg-blue-50 transition duration-200">
            <TableBodyData>Total</TableBodyData>
            <TableBodyData>{moneyFormat(totalBudgetAmount)}</TableBodyData>
            <TableBodyData>{moneyFormat(totalSpent)}</TableBodyData>
            <TableBodyData colSpan={5}>
              <div className={`${totalRemaining < 0 ? "text-red-700" : ""}`}>
                {moneyFormat(totalRemaining)}
              </div>{" "}
            </TableBodyData>
          </tr>
        )}
      </Table>
    </div>
  );
};

export default CategoryWiseBudget;
