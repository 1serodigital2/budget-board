import { Link } from "react-router-dom";
import H1 from "../../components/ui/Heading";
import Table from "../../components/ui/Table";
import TableBodyData from "../../components/ui/TableBodyData";
import useBudget from "../../hooks/useBudget";

const BudgetListingPage = () => {
  const { getAllBudgets } = useBudget();
  const { data, isLoading, isError, error } = getAllBudgets();
  console.log("budget data", data);
  return (
    <>
      <H1>Budget page</H1>
      <Table
        columnNames={["SL No.", "Category", "Amount", "Month", "Action"]}
        data={data ?? []}
      >
        {data &&
          data.map((budget, i) => (
            <tr
              key={budget.id}
              className="bg-neutral-primary border-b border-default"
            >
              <TableBodyData>{i + 1}</TableBodyData>
              <TableBodyData item={budget.category} />
              <TableBodyData item={budget.amount} />
              <TableBodyData>{budget.month}</TableBodyData>
              <TableBodyData>
                <button className="mr-3 text-blue-600 cursor-pointer">
                  <Link to={`${budget.id}/edit`}>Edit</Link>
                </button>
                <button className="text-red-800 cursor-pointer">Delete</button>
              </TableBodyData>
            </tr>
          ))}
      </Table>
    </>
  );
};
export default BudgetListingPage;
