import { useMutation, useQuery } from "@tanstack/react-query";
import { NavLink } from "react-router-dom";

import Table from "../ui/Table";
import { deleteCategory, getCategories } from "../../api/category";
import { useAuth } from "../../context/AuthContext";
import TableBodyData from "../ui/TableBodyData";
import Alert from "../ui/Alert";
import useSubmitMessage from "../../hooks/useSubmitMessage";
import { queryClient } from "../../services/firebase";

const CategoriesList = () => {
  const { user } = useAuth();
  const { showSubmitMessage, submitMessage } = useSubmitMessage();
  const userId = user?.uid;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(userId!),
    enabled: !!userId,
  });

  const {
    mutate,
    isPending,
    isError: deleteIsError,
    error: deleteError,
  } = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      showSubmitMessage("Category deleted successfully", "success");
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
    onError: () => {
      showSubmitMessage("Unable to delete category", "error");
    },
  });

  console.log("category data", data);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure to delete this category") === false) return;
    try {
      if (!user?.uid) {
        throw new Error("User id is missing");
      }
      mutate({ userId: user?.uid, categoryId: id });
    } catch (error) {
      showSubmitMessage("Fatal error " + error, "error");
    }
  };

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
    <>
      {submitMessage && submitMessage.message !== "" && (
        <Alert type={submitMessage.type} message={submitMessage.message} />
      )}
      <Table
        columnNames={["SL No", "Category", "Color", "CreatedAt", "Action"]}
        data={data}
      >
        {data &&
          data.map((category, i) => (
            <tr
              key={category.id}
              className="bg-neutral-primary border-b border-default"
            >
              <TableBodyData>{i + 1}</TableBodyData>
              <TableBodyData item={category.name} />
              <TableBodyData>
                {category?.color ? (
                  <div
                    className="h-3.5 w-full"
                    style={{ backgroundColor: category.color }}
                  ></div>
                ) : (
                  "N/A"
                )}
              </TableBodyData>
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

                <button
                  disabled={isPending}
                  onClick={() => handleDelete(category.id)}
                  className="cursor-pointer text-red-900 disabled:opacity-50"
                >
                  {isPending ? "Deleting..." : "Delete"}
                </button>
              </TableBodyData>
            </tr>
          ))}
      </Table>
    </>
  );
};
export default CategoriesList;
