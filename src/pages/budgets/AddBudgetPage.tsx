import { useState } from "react";

import Select from "../../components/form/Select";
import Submit from "../../components/form/Submit";
import Input from "../../components/Input";
import H1 from "../../components/ui/Heading";
import { useCategories } from "../../hooks/useCategories";
import useInputChange from "../../hooks/useInputChange";
import { HandleInputChangeType } from "../../types/category";
import useBudget from "../../hooks/useBudget";
import { useAuth } from "../../context/AuthContext";
import useSubmitMessage from "../../hooks/useSubmitMessage";
import Alert from "../../components/ui/Alert";

const AddBudgetPage = () => {
  // const { inputValue, setInputChange } = useInputChange();
  const { user } = useAuth();
  const [inputValue, setInputValue] = useState({
    category: "",
    amount: 0,
    month: "",
  });
  const { data, isLoading, isError, error } = useCategories();
  const { submitBudgetForm, submitMessage: subMessage } = useBudget();
  const { mutate, isPending } = submitBudgetForm();

  const { submitMessage, showSubmitMessage } = useSubmitMessage();

  const handleInputChange = ({ name, inputValue }: HandleInputChangeType) => {
    setInputValue((prevState) => {
      return {
        ...prevState,
        [name]: inputValue,
      };
    });
  };

  const handleFormSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!user?.uid) {
      showSubmitMessage("User id is required", "error");
      return;
    }
    if (inputValue.amount <= 0) {
      showSubmitMessage("Amount must be greater than 0", "error");
      return;
    }
    mutate({ budgetDetail: inputValue, uid: user?.uid });
  };
  return (
    <>
      <H1>Budget page</H1>
      {submitMessage && submitMessage.message !== "" && (
        <Alert type={submitMessage.type} message={submitMessage.message} />
      )}
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
    </>
  );
};
export default AddBudgetPage;
