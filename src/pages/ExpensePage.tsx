import { useParams } from "react-router-dom";

import { useQuery } from "@tanstack/react-query";
import { getExpenseById } from "../api/expenses";
import { useAuth } from "../context/AuthContext";
import Alert from "../components/ui/Alert";

const ExpensePage = () => {
  const { user } = useAuth();
  const params = useParams();
  const id = params.id;
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["expenses", id],
    queryFn: () => getExpenseById({ uid: user.uid, id }),
  });

  if (isLoading) {
    return <Alert message="Expense detail is loading..." />;
  }

  if (isError) {
    return (
      <Alert type="error" message={error.message || "Something went wrong"} />
    );
  }

  return (
    <>
      <h1 className="text-xl mb-2">Expense detail</h1>
      <h2>Category: {data.category}</h2>
      <div>Amount: {data.amount}</div>
      <div>Note: {data.note}</div>
      <div>
        Date:
        {data.createdAt?.toDate
          ? data.createdAt.toDate().toLocaleDateString()
          : "No date"}
      </div>
    </>
  );
};

export default ExpensePage;

export const loader = ({ request }) => {
  const expenseId = request.id;
};
