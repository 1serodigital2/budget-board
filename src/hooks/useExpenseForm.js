// hooks
import { useState } from "react";
const initialValues = {
    amount: 0,
    category: "",
    note: "",
};
const useExpenseForm = (defaultValues = initialValues) => {
    const [inputValues, setInputValues] = useState(defaultValues);
    const [submitMessage, setSubmitMessage] = useState({
        message: "",
    });
    const handleInputChange = ({ name, inputValue }) => {
        console.log("name ", name);
        console.log("inputValue ", inputValue);
        // if (!name || !inputValue) {
        //   console.error("Please fill up the form properly");
        // }
        setInputValues((prevState) => {
            return {
                ...prevState,
                [name]: inputValue,
            };
        });
    };
    const showSubmitMessage = (message, type) => {
        setSubmitMessage({ message, type });
        setTimeout(() => {
            setSubmitMessage({ message: "" });
        }, 3000);
    };
    const resetForm = () => {
        setInputValues(defaultValues);
    };
    const getExpenseDetail = () => {
        return {
            amount: Number(inputValues.amount) || 0,
            category: inputValues.category?.toString() || "",
            note: inputValues.note?.toString() || "",
        };
    };
    return {
        inputValues,
        submitMessage,
        handleInputChange,
        resetForm,
        showSubmitMessage,
        getExpenseDetail,
        setInputValues,
    };
};
export default useExpenseForm;
