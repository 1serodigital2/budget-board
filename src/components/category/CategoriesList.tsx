import { useQuery } from "@tanstack/react-query";
import { NavLink } from "react-router-dom";

import Table from "../ui/Table";
import { getCategories } from "../../api/category";
import { useAuth } from "../../context/AuthContext";
import TableBodyData from "../ui/TableBodyData";
import Alert from "../ui/Alert";

const CategoriesList = () => {
  const { user } = useAuth();
  const userId = user?.uid;
  
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["categories", userId],
    queryFn: () => getCategories(userId!),
    enabled: !!userId,
  });

  console.log("category data", data);

  if (isLoading) {
    return <Alert message="Categories are loading..." />;
  }

  if (isError) {
    return (
      <Alert
        type="error"
        message={error.message || "Unable to fetch categories"}
      />
    );
  }

  return (
    <Table
      columnNames={["SL No", "Category", "Color", "CreatedAt", "Action"]}
      data={data}
    >
      {data && data.map((category, i) => (
        <tr
          key={category.id}
          className="bg-neutral-primary border-b border-default"
        >
          <TableBodyData>{i + 1}</TableBodyData>
          <TableBodyData item={category.name} />
          <TableBodyData item={category.color} />
          <TableBodyData
            item={
              category.createdAt?.toDate
                ? category.createdAt.toDate().toLocaleDateString()
                : "No date"
            }
          />
          <TableBodyData>
            <NavLink
              to={category.id}
              className="cursor-pointer btn-primary mr-4 text-green-700"
            >
              View
            </NavLink>

            <NavLink
              to={`${category.id}/edit`}
              className="cursor-pointer btn-primary mr-4 text-blue-600"
            >
              Edit
            </NavLink>

            {/* <button
              disabled={isPending}
              onClick={() => handleDelete(category.id)}
              className="cursor-pointer text-red-900 disabled:opacity-50"
            >
              {isPending ? "Deleting..." : "Delete"}
            </button> */}
          </TableBodyData>
        </tr>
      ))}
    </Table>
  );
};
export default CategoriesList;
