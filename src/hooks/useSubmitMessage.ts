import { useState } from "react";
import { AlertProps } from "../types/FormTypes";

const useSubmitMessage = () => {
  const [submitMessage, setSubmitMessage] = useState<AlertProps>({
    message: "",
  });

  const showSubmitMessage = (message: string, type?: "success" | "error") => {
    setSubmitMessage({ message, type });

    setTimeout(() => {
      setSubmitMessage({ message: "" });
    }, 3000);
  };

  return { showSubmitMessage, submitMessage };
};

export default useSubmitMessage;
