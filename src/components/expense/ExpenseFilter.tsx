import { useState } from "react";
import Select from "../form/Select";
import Input from "../Input";
import { HandleInputChangeType } from "../../types/category";

const ExpenseFilter = ({catData}) => {
  const [inputValue, setInputValue] = useState({
    category: "",
    keyword: "",
  });
  const handleInputChange = ({ name, inputValue }: HandleInputChangeType) => {
    setInputValue((prevState) => {
      return {
        ...prevState,
        [name]: inputValue,
      };
    });
  };
  return (
    <form action="" className="mb-3">
      <div className="flex">
        <Select
          getOptionValue={(category) => category?.id}
          getOptionLabel={(category) => category?.name}
          name="category"
          data={catData || []}
          label="Category"
          required
          handleInputChange={handleInputChange}
          inputValues={inputValue.category || ""}
        />
        <Input
          name="keyword"
          placeholder="Search..."
          handleInputChange={handleInputChange}
          sx="text-black mr-2"
          inputValues={inputValue.keyword}
        />
        {/* <Submit /> */}
      </div>
    </form>
  );
};

export default ExpenseFilter;
