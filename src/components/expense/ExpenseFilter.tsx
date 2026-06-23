import Select from "../form/Select";
import Input from "../Input";
import Submit from "../form/Submit";
import { ExpenseFilterProps } from "../../types/expense";
import DateRangePicker from "../form/DatePicket";
import Datep from "../form/DatePicket";
import { Timestamp } from "firebase/firestore";
import MyForm from "../form/Form";

const ExpenseFilter = ({
  catData,
  handleInputChange,
  handleFilterSubmit,
  handleFilterReset,
  filter,
  isPending,
}: ExpenseFilterProps) => {
  return (
    <MyForm
      onSubmit={handleFilterSubmit}
      onReset={handleFilterReset}
      // className="mb-3 max-w-3xl"
    >
      <div className="flex gap-3 items-center">
        <Select
          getOptionValue={(category: any) => category?.id}
          getOptionLabel={(category: any) => category?.name}
          name="category"
          data={Array.isArray(catData) ? catData : catData ? [catData] : []}
          handleInputChange={handleInputChange}
          inputValues={filter.category || ""}
        />
        <DateRangePicker
          handleInputChange={handleInputChange}
          inputValues={filter.dateRange}
        />
        <Submit isPending={isPending} />
        {(filter.category !== "" ||
          (filter.dateRange?.start instanceof Date &&
            filter.dateRange?.end instanceof Date)) && (
          <Submit type="reset" isPending={isPending} />
        )}
      </div>
    </MyForm>
  );
};

export default ExpenseFilter;
