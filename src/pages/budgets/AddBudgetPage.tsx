import H1 from "../../components/ui/Heading";
import { HandleInputChangeType } from "../../types/category";
import useBudget from "../../hooks/useBudget";
import { useAuth } from "../../context/AuthContext";
import Alert from "../../components/ui/Alert";
import BudgetForm from "../../components/form/Budget";

const AddBudgetPage = () => {
  const { user } = useAuth();
  const {
    useAddBudgetForm,
    submitMessage,
    setInputValue,
    inputValue,
    showSubmitMessage,
  } = useBudget();

  const { mutate, isPending, isError, error } = useAddBudgetForm();

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
      {submitMessage && submitMessage.message !== "" && !isError && (
        <Alert type={submitMessage.type} message={submitMessage.message} />
      )}
      {isError && (
        <Alert type="error" message={error.message || "error adding budget"} />
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
export default AddBudgetPage;
