import { Link } from "react-router-dom";
import H1 from "../../components/ui/Heading";
import Table from "../../components/ui/Table";
import TableBodyData from "../../components/ui/TableBodyData";
import useBudget from "../../hooks/useBudget";
import Alert from "../../components/ui/Alert";
import { moneyFormat } from "../../utils/helpers";

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
        <div className="mb-5 bg-white rounded-lg border p-4">
          <Table
            columnNames={["SL No.", "Category", "Amount", "Month", "Action"]}
            data={data ?? []}
          >
            {data &&
              data.map((budget, i) => (
                <tr
                  key={budget.id}
                  className={`bg-neutral-primary ${i !== data.length - 1 ? "border-b border-default" : ""}`}
                >
                  <TableBodyData>{i + 1}</TableBodyData>
                  <TableBodyData item={budget.category} />
                  <TableBodyData item={moneyFormat(budget.amount)} />
                  <TableBodyData>{budget.month}</TableBodyData>
                  <TableBodyData>
                    <div className="flex items-center gap-2">
                      <button className="text-blue-600 cursor-pointer bg-blue-100 py-1 px-2 rounded  hover:bg-blue-600 hover:text-white transition duration-200">
                        <Link
                          to={`${budget.id}/edit`}
                          className=" text-[.7rem] flex items-center gap-1"
                        >
                          <span
                            className="material-symbols-outlined"
                            style={{
                              fontSize: ".8rem",
                            }}
                          >
                            edit
                          </span>
                          <span>Edit</span>
                        </Link>
                      </button>
                      <button
                        className="text-red-800 cursor-pointer flex items-center gap-1 text-[.7rem] bg-red-100 rounded py-1 px-2 hover:bg-red-700 hover:text-white transition duration-200"
                        onClick={() => deleteBudget(budget.id)}
                        disabled={isPending}
                      >
                        <span
                          className="material-symbols-outlined"
                          style={{
                            fontSize: ".8rem",
                          }}
                        >
                          delete
                        </span>
                        {isPending ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </TableBodyData>
                </tr>
              ))}
          </Table>
        </div>
      )}
    </>
  );
};
export default BudgetListingPage;
