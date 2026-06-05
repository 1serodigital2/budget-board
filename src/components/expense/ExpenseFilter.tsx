import Select from "../form/Select";
import Input from "../Input";
import Submit from "../form/Submit";
import { ExpenseFilterProps } from "../../types/expense";
import DateRangePicker from "../form/DatePicket";
import Datep from "../form/DatePicket";

const ExpenseFilter = ({
  catData,
  handleInputChange,
  handleFilterSubmit,
  filter,
}: ExpenseFilterProps) => {
  return (
    <form onSubmit={handleFilterSubmit} className="mb-3 max-w-3xl">
      <div className="flex gap-5 items-center">
        <Select
          getOptionValue={(category: any) => category?.id}
          getOptionLabel={(category: any) => category?.name}
          name="category"
          data={Array.isArray(catData) ? catData : catData ? [catData] : []}
          handleInputChange={handleInputChange}
          inputValues={filter.category || ""}
        />
        <DateRangePicker handleInputChange={handleInputChange} inputValues={filter.dateRange} />
        <Submit />
      </div>
    </form>
  );
};

export default ExpenseFilter;
