import { NavLink } from "react-router-dom";

import Alert from "../ui/Alert";
import Table from "../ui/Table";
import TableBodyData from "../ui/TableBodyData";

import { moneyFormat } from "../../utils/helpers";
import { BudgetTableProps, BudgetTableTypes } from "../../types/budget";

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
    "Action",
  ];

  if (!hideMonth) {
    columns.splice(columns.length - 1, 0, "Month");
  }

  const bgColor = (percentage: number) => {
    return percentage > 100
      ? "bg-red-600"
      : percentage >= 80
        ? "bg-yellow-500"
        : "bg-green-500";
  };

  return (
    <Table columnNames={columns}>
      {budgetData.map((budget, i) => (
        <tr className="bg-neutral-primary border-b border-default">
          {/* <TableBodyData>{i + 1}</TableBodyData> */}
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
          {columns.includes("Month") && (
            <TableBodyData>{budget.budgetMonth}</TableBodyData>
          )}

          <TableBodyData>
            {budget.spent > 0 && (
              <NavLink
                to={`/expenses?month=${monthFilter}&category=${budget.categorySlug}`}
              >
                View
              </NavLink>
            )}
          </TableBodyData>
        </tr>
      ))}
      {showTotal && (
        <tr className="bg-neutral-primary border-b border-default">
          <TableBodyData colSpan={2}>Total</TableBodyData>
          <TableBodyData>{moneyFormat(totalBudgetAmount)}</TableBodyData>
          <TableBodyData>{moneyFormat(totalSpent)}</TableBodyData>
          <TableBodyData></TableBodyData>
          <TableBodyData>{moneyFormat(totalRemaining)}</TableBodyData>
        </tr>
      )}
    </Table>
  );
};

export default CategoryWiseBudget;
