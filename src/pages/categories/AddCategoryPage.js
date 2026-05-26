import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useMutation } from "@tanstack/react-query";
import H1 from "../../components/ui/Heading";
import useCategoryForm from "../../hooks/useCategorForm";
import { addCategory } from "../../api/category";
import { queryClient } from "../../services/firebase";
import { useAuth } from "../../context/AuthContext";
import CategoryForm from "../../components/form/Category";
import useSubmitMessage from "../../hooks/useSubmitMessage";
const AddCategoryPage = () => {
    const { inputValues, resetForm, handleInputChange } = useCategoryForm();
    const { showSubmitMessage, submitMessage } = useSubmitMessage();
    const { user } = useAuth();
    const { mutate, isPending, isError, error } = useMutation({
        mutationFn: addCategory,
        onSuccess: () => {
            console.log("category added");
            showSubmitMessage("Category added successfully", "success");
            resetForm();
            queryClient.invalidateQueries({
                queryKey: ["category"],
            });
        },
        onError: (error) => {
            showSubmitMessage(error.message, "error");
        },
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!user?.uid) {
            showSubmitMessage("Fatal error " + error);
            return;
        }
        mutate({ userId: user.uid, categoryDetail: inputValues });
    };
    return (_jsxs(_Fragment, { children: [_jsx(H1, { children: "Add Category" }), _jsx(CategoryForm, { isPending: isPending, submitMessage: submitMessage, handleSubmit: handleSubmit, handleInputChange: handleInputChange, inputValues: inputValues })] }));
};
export default AddCategoryPage;
