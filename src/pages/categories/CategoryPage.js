import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import H1 from "../../components/ui/Heading";
import { getCategoryById } from "../../api/category";
import { useAuth } from "../../context/AuthContext";
import Alert from "../../components/ui/Alert";
const CategoryPage = () => {
    const { user } = useAuth();
    const params = useParams();
    const categoryId = params.id;
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["categories", categoryId],
        queryFn: () => getCategoryById({ userId: user.uid, categoryId: categoryId }),
        enabled: !!user?.uid && !!categoryId,
    });
    if (isLoading) {
        return _jsx(Alert, { message: "Loading category detail..." });
    }
    if (isError) {
        return (_jsx(Alert, { type: "error", message: error.message || "Unable to fetch category" }));
    }
    if (!data) {
        return _jsx(Alert, { message: "No category data available." });
    }
    return (_jsxs(_Fragment, { children: [_jsx(H1, { children: "Category detail" }), _jsxs("div", { children: ["Category name: ", data.category] }), _jsxs("div", { children: ["Color: ", data.color] }), _jsxs("div", { children: ["Creation date:", " ", data.createdAt?.toDate
                        ? data.createdAt.toDate().toLocaleDateString()
                        : "No date"] })] }));
};
export default CategoryPage;
