import { useCategories } from "../../hooks/useCategories";
import { BudgetFormType } from "../../types/budget";
import Input from "../Input";
import Alert from "../ui/Alert";
import Select from "./Select";
import Submit from "./Submit";

const BudgetForm = ({
  handleFormSubmit,
  inputValue,
  handleInputChange,
  isPending,
}: BudgetFormType) => {
  const { useGetCategories } = useCategories();
  const { data, isError, error } = useGetCategories();

  if (isError) {
    return (
      <Alert
        message={error.message || "Unable to fetch categories"}
        type="error"
      />
    );
  }
  return (
    <div className="bg-(--color-primary) p-5 rounded-3xl w-125">
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
            min="10"
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
    </div>
  );
};

export default BudgetForm;
