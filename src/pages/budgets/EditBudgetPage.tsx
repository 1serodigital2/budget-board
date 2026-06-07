import { useParams } from "react-router-dom";

import BudgetForm from "../../components/form/Budget";
import Alert from "../../components/ui/Alert";
import H1 from "../../components/ui/Heading";
import useBudget from "../../hooks/useBudget";
import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { HandleInputChangeType } from "../../types/category";

const EditBudgetPage = () => {
  const { user } = useAuth();
  const params = useParams();
  const budgetId = params.id;
  const {
    inputValue,
    useBudgetUpdate,
    submitMessage,
    getBudget,
    setInputValue,
    showSubmitMessage,
  } = useBudget();

  const { data, isLoading, isError, error } = getBudget(budgetId!);

  const {
    mutate,
    isPending,
    isError: updateIsError,
    error: updateError,
  } = useBudgetUpdate(params.id!);

  useEffect(() => {
    if (data) {
      const budgetData = {
        category: data.category,
        amount: data.amount,
        month: data.month,
      };
      setInputValue(budgetData);
    }
  }, [data]);

  const handleFormSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (inputValue.amount < 0 || !inputValue.category) {
      showSubmitMessage("Please fill up the form properly", "error");
      return;
    }
    mutate(inputValue);
  };

  const handleInputChange = ({ name, inputValue }: HandleInputChangeType) => {
    setInputValue((prevState) => {
      return {
        ...prevState,
        [name]: inputValue,
      };
    });
  };

  if (isLoading) {
    return <Alert message="Getting budget detail..." />;
  }

  return (
    <>
      <H1>Edit Budget</H1>
      {updateIsError && (
        <Alert
          type="error"
          message={updateError.message || "Failed to update"}
        />
      )}
      {updateIsError && (
        <Alert
          type="error"
          message={updateError.message || "Failed to update"}
        />
      )}
      {submitMessage && submitMessage.message !== "" && (
        <Alert type={submitMessage.type} message={submitMessage.message} />
      )}

      <BudgetForm
        handleFormSubmit={handleFormSubmit}
        inputValue={inputValue}
        handleInputChange={handleInputChange}
        isPending={isPending}
      />
    </>
  );
};

export default EditBudgetPage;
