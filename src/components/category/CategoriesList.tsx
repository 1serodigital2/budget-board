import { queryClient } from "../../services/supabase";
import { useMutation, useQuery } from "@tanstack/react-query";
import { NavLink } from "react-router-dom";

import Table from "../ui/Table";
import { deleteCategory, getCategories } from "../../api/category";
import { useAuth } from "../../context/AuthContext";
import TableBodyData from "../ui/TableBodyData";
import Alert from "../ui/Alert";
import useSubmitMessage from "../../hooks/useSubmitMessage";

import MyButton from "../form/MyButton";
import { formatInDate } from "../../utils/helpers";

const CategoriesList = () => {
  const { user } = useAuth();
  const { showSubmitMessage, submitMessage } = useSubmitMessage();
  const userId = user?.id;

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

  const handleDelete = (id: string) => {
    if (confirm("Are you sure to delete this category") === false) return;
    try {
      if (!user?.id) {
        throw new Error("User id is missing");
      }
      mutate({ userId: user?.id!, categoryId: Number(id) });
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
      <div className="bg-white rounded-lg border p-4">
        <Table
          columnNames={["SL No", "Category", "Color", "CreatedAt", "Action"]}
          data={data ?? []}
        >
          {data &&
            data.map((category, i) => (
              <tr
                key={category.id}
                className={`bg-neutral-primary ${i !== data.length - 1 ? "border-b border-default" : ""}`}
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
                    category.createdAt
                      ? formatInDate(category.createdAt)
                      : "No date"
                  }
                />
                <TableBodyData>
                  <div className="flex gap-1 items-center">
                    <MyButton btnType="view" btnSlug={category.id.toString()} />

                    {!category.isSystem && (
                      <>
                        <MyButton
                          btnType="edit"
                          btnSlug={`${category.id}/edit`}
                        />
                        <MyButton
                          btnType="delete"
                          btnSlug={category.id.toString()}
                          isPending={isPending}
                          deleteFn={handleDelete}
                          id={category.id.toString()}
                        />
                      </>
                    )}
                  </div>
                </TableBodyData>
              </tr>
            ))}
        </Table>
      </div>
    </>
  );
};
export default CategoriesList;
