import Select from "../form/Select";
import Input from "../Input";
import Submit from "../form/Submit";
import { ExpenseFilterProps } from "../../types/expense";

const ExpenseFilter = ({
  catData,
  handleInputChange,
  handleFilterSubmit,
  filter,
}: ExpenseFilterProps) => {
  return (
    <form onSubmit={handleFilterSubmit} className="mb-3">
      <div className="flex">
        <Select
          getOptionValue={(category: any) => category?.id}
          getOptionLabel={(category: any) => category?.name}
          name="category"
          data={Array.isArray(catData) ? catData : catData ? [catData] : []}
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
