import { useState } from "react";
const useSubmitMessage = () => {
    const [submitMessage, setSubmitMessage] = useState({
        message: "",
    });
    const showSubmitMessage = (message, type) => {
        setSubmitMessage({ message, type });
        setTimeout(() => {
            setSubmitMessage({ message: "" });
        }, 3000);
    };
    return { showSubmitMessage, submitMessage };
};
export default useSubmitMessage;
