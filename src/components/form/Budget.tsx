import { BudgetFormType } from "../../types/budget";
import Input from "../Input";
import Select from "./Select";
import Submit from "./Submit";

const BudgetForm = ({
  handleFormSubmit,
  data,
  inputValue,
  handleInputChange,
  isPending,
}: BudgetFormType) => {
  return (
    <form onSubmit={handleFormSubmit}>
      <div className="mb-2">
        <Select
          label="Category"
          name="category"
          data={data || []}
          getOptionLabel={(category) => category.name}
          getOptionValue={(category) => category.id}
          required
          handleInputChange={handleInputChange}
          inputValues={inputValue.category}
        />
      </div>
      <div className="flex gap-4 mb-2">
        <Input
          type="number"
          label="Amount"
          name="amount"
          required
          inputValues={inputValue.amount}
          handleInputChange={handleInputChange}
        />
        <Input
          type="month"
          label="Month"
          name="month"
          required
          inputValues={inputValue.month}
          handleInputChange={handleInputChange}
        />
      </div>
      <Submit isPending={isPending} />
    </form>
  );
};
