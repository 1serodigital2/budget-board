import { ExpenseFormProps } from "../../types/FormTypes";

import Alert from "../ui/Alert";
import Input from "../Input";
import Submit from "./Submit";

const ExpenseForm = ({
  handleFormSubmit,
  handleInputChange,
  inputValues,
  isPending,
  submitMessage
}: ExpenseFormProps) => {

  return (
    <>
       {submitMessage && submitMessage.message !== "" && (
        <Alert type={submitMessage.type} message={submitMessage.message} />
      )}
      <form
        onSubmit={handleFormSubmit}
        className="bg-(--color-primary) p-8 rounded-3xl max-w-3xl"
      >
        <div className="mb-2 5">
          <Input
            type="number"
            name="amount"
            label="Amount"
            required
            handleInputChange={handleInputChange}
            inputValues={inputValues.amount || ""}
          />
        </div>
        <div className="mb-2 5">
          <Input
            name="category"
            label="Category"
            required
            handleInputChange={handleInputChange}
            inputValues={inputValues.category || ""}
          />
        </div>
        <div className="mb-2 5">
          <Input
            name="note"
            label="Short note"
            handleInputChange={handleInputChange}
            inputValues={inputValues.note || ""}
          />
        </div>
        <Submit isPending={isPending} />
      </form>
    </>
  );
};

export default ExpenseForm;
