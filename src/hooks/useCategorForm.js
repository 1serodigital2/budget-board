import { useState } from "react";
const defaultValues = {
    category: "",
    color: "",
};
const useCategoryForm = (initialValues = defaultValues) => {
    const [inputValues, setInputValues] = useState(initialValues);
    const handleInputChange = ({ name, inputValue }) => {
        console.log("name ", name);
        console.log("inputValues ", inputValue);
        setInputValues((prevState) => {
            return {
                ...prevState,
                [name]: inputValue,
            };
        });
    };
    const resetForm = () => {
        setInputValues(defaultValues);
    };
    const getCategoryDetail = () => {
        return {
            category: inputValues.category,
            color: inputValues.color,
        };
    };
    return {
        handleInputChange,
        inputValues,
        resetForm,
        setInputValues,
        getCategoryDetail
    };
};
export default useCategoryForm;
