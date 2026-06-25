import { Link } from "react-router-dom";
import H1 from "../../components/ui/Heading";
import Table from "../../components/ui/Table";
import TableBodyData from "../../components/ui/TableBodyData";
import useBudget from "../../hooks/useBudget";
import Alert from "../../components/ui/Alert";
import { moneyFormat } from "../../utils/helpers";
import MyButton from "../../components/form/MyButton";

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
                      <MyButton  btnType="edit" id={budget.id.toString()} btnSlug={`${budget.id}/edit`} />
                      <MyButton
                        btnType="delete"
                        id={budget.id.toString()}
                        deleteFn={deleteBudget}
                        isPending={isPending}
                      />
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
