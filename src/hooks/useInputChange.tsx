import { useState } from "react";
import { HandleInputChangeType } from "../types/category";

const useInputChange = () => {
  const [inputValue, setInputValue] = useState({
    name: "",
    inputValue: "",
  });

  const setInputChange = ({ name, inputValue }: HandleInputChangeType) => {
    setInputValue((prevState) => {
      return {
        ...prevState,
        [name]: inputValue,
      };
    });
  };

  return {
    inputValue,
    setInputChange
  }
};
export default useInputChange;
