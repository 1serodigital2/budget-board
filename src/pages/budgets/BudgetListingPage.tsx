import { Link } from "react-router-dom";
import H1 from "../../components/ui/Heading";
import Table from "../../components/ui/Table";
import TableBodyData from "../../components/ui/TableBodyData";
import useBudget from "../../hooks/useBudget";
import Alert from "../../components/ui/Alert";

const BudgetListingPage = () => {
  const { getAllBudgets, useDeleteBudget, submitMessage } = useBudget();
  const { data, isLoading, isError, error } = getAllBudgets();

  const {
    mutate,
    isPending,
    isError: deleteIsError,
    error: deleteError,
  } = useDeleteBudget();

  const deleteBudget = (budgetId: string) => {
    if (confirm("Are you sure to delete this budget") === true) {
      mutate(budgetId);
    }
  };

  return (
    <>
      <H1>Budget page</H1>
      {isLoading && <Alert message="Getting budget lists..." />}
      {!isLoading && data && data?.length <= 0 && (
        <Alert message="Data not found" />
      )}
      {submitMessage && submitMessage.message !== "" && (
        <Alert message={submitMessage.message} type={submitMessage.type} />
      )}
      {data && data.length > 0 && (
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
                  <button
                    className="text-red-800 cursor-pointer"
                    onClick={() => deleteBudget(budget.id)}
                    disabled={isPending}
                  >
                    {isPending ? "Deleting..." : "Delete"}
                  </button>
                </TableBodyData>
              </tr>
            ))}
        </Table>
      )}
    </>
  );
};
export default BudgetListingPage;
