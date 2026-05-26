import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getExpenseById } from "../../api/expenses";
import { useAuth } from "../../context/AuthContext";
import Alert from "../../components/ui/Alert";
import useSubmitMessage from "../../hooks/useSubmitMessage";
import { getCategories } from "../../api/category";
const ExpensePage = () => {
    const { submitMessage, showSubmitMessage } = useSubmitMessage();
    const { user } = useAuth();
    const params = useParams();
    const id = params.id;
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["expenses", id],
        queryFn: () => {
            if (!user?.uid || !id) {
                showSubmitMessage("Unauthorized access", "error");
                return;
            }
            return getExpenseById({ uid: user.uid, id });
        },
    });
    const { data: catData, isError: catIsError, error: catError, } = useQuery({
        queryKey: ["categories"],
        queryFn: () => {
            if (!user?.uid) {
                showSubmitMessage("Unauthorized access", "error");
                return;
            }
            return getCategories(user.uid);
        },
    });
    if (isLoading) {
        return _jsx(Alert, { message: "Expense detail is loading..." });
    }
    if (isError) {
        return (_jsx(Alert, { type: "error", message: error.message || "Something went wrong" }));
    }
    if (!catData) {
        return (_jsx(Alert, { type: "error", message: "Something went wrong while fetchin category" }));
    }
    if (catIsError) {
        return (_jsx(Alert, { type: "error", message: catError.message || "Something went wrong" }));
    }
    const category = catData.find((category) => category.id === data?.category);
    return (_jsxs(_Fragment, { children: [_jsx("h1", { className: "text-xl mb-2", children: "Expense detail" }), _jsxs("h2", { children: ["Category: ", category?.name] }), _jsxs("div", { children: ["Amount: ", data?.amount] }), _jsxs("div", { children: ["Note: ", data?.note] }), _jsxs("div", { children: ["Date:", data?.createdAt?.toDate
                        ? data?.createdAt.toDate().toLocaleDateString()
                        : "No date"] })] }));
};
export default ExpensePage;
