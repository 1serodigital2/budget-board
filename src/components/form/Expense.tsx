import { ExpenseFormProps } from "../../types/expense";

import Alert from "../ui/Alert";
import Input from "../Input";
import Submit from "./Submit";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../../api/category";
import { useAuth } from "../../context/AuthContext";
import useSubmitMessage from "../../hooks/useSubmitMessage";
import Select from "./Select";

const ExpenseForm = ({
  handleFormSubmit,
  handleInputChange,
  inputValues,
  isPending,
  submitMessage,
}: ExpenseFormProps) => {
  const { user } = useAuth();
  const { showSubmitMessage } = useSubmitMessage();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["categories"],
    queryFn: () => {
      if (!user?.uid) {
        showSubmitMessage("Unauthorized access", "error");
        return;
      }
      return getCategories(user.uid);
    },
  });

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
        <div className="flex justify-between gap-5">
          <Select
            getOptionValue={(category) => category.id}
            getOptionLabel={(category) => category.name}
            name="category"
            data={data || []}
            label="Category"
            required
            handleInputChange={handleInputChange}
            inputValues={inputValues.category || ""}
          />
          <Input
            type="date"
            name="date"
            label="Expense incurred on"
            required
            handleInputChange={handleInputChange}
            inputValues={
              inputValues.date || new Date().toISOString().split("T")[0]
            }
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
