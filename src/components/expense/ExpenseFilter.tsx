import { useState } from "react";
import Select from "../form/Select";
import Input from "../Input";
import { CategoryType, HandleInputChangeType } from "../../types/category";
import Submit from "../form/Submit";

const ExpenseFilter = ({
  catData,
  handleInputChange,
  handleFilterSubmit,
  filter,
}) => {
  return (
    <form onSubmit={handleFilterSubmit} className="mb-3">
      <div className="flex">
        <Select
          getOptionValue={(category) => category?.id}
          getOptionLabel={(category) => category?.name}
          name="category"
          data={catData || []}
          label="Category"
          handleInputChange={handleInputChange}
          inputValues={filter.category || ""}
        />
        <Input
          name="keyword"
          placeholder="Search..."
          handleInputChange={handleInputChange}
          sx="text-black mr-2"
          inputValues={filter.keyword}
        />
        <Submit />
      </div>
    </form>
  );
};

export default ExpenseFilter;
