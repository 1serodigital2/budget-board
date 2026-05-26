import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
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
        queryFn: () => getCategories(userId),
        enabled: !!userId,
    });
    const { mutate, isPending, isError: deleteIsError, error: deleteError, } = useMutation({
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
    const handleDelete = (id) => {
        if (confirm("Are you sure to delete this category") === false)
            return;
        try {
            if (!user?.uid) {
                throw new Error("User id is missing");
            }
            mutate({ userId: user?.uid, categoryId: id });
        }
        catch (error) {
            showSubmitMessage("Fatal error " + error, "error");
        }
    };
    if (isLoading) {
        return _jsx(Alert, { message: "Categories are loading..." });
    }
    if (isError) {
        return (_jsx(Alert, { type: "error", message: error.message || "Unable to fetch categories" }));
    }
    return (_jsxs(_Fragment, { children: [submitMessage && submitMessage.message !== "" && (_jsx(Alert, { type: submitMessage.type, message: submitMessage.message })), _jsx(Table, { columnNames: ["SL No", "Category", "Color", "CreatedAt", "Action"], data: data ?? [], children: data &&
                    data.map((category, i) => (_jsxs("tr", { className: "bg-neutral-primary border-b border-default", children: [_jsx(TableBodyData, { children: i + 1 }), _jsx(TableBodyData, { item: category.name }), _jsx(TableBodyData, { children: category?.color ? (_jsx("div", { className: "h-3.5 w-full", style: { backgroundColor: category.color } })) : ("N/A") }), _jsx(TableBodyData, { item: category.createdAt?.toDate
                                    ? category.createdAt.toDate().toLocaleDateString()
                                    : "No date" }), _jsxs(TableBodyData, { children: [_jsx(NavLink, { to: category.id, className: "cursor-pointer btn-primary mr-4 text-green-700", children: "View" }), !category.isSystem && (_jsxs(_Fragment, { children: [_jsx(NavLink, { to: `${category.id}/edit`, className: "cursor-pointer btn-primary mr-4 text-blue-600", children: "Edit" }), _jsx("button", { disabled: isPending, onClick: () => handleDelete(category.id), className: "cursor-pointer text-red-900 disabled:opacity-50", children: isPending ? "Deleting..." : "Delete" })] }))] })] }, category.id))) })] }));
};
export default CategoriesList;
