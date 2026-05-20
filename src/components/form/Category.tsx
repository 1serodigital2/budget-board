import useCategoryForm from "../../hooks/useCategorForm";
import Input from "../Input";
import Alert from "../ui/Alert";
import Submit from "./Submit";

const Category = ({ isPending, submitMessage, handleSubmit, handleInputChange, inputValues }) => {
  // const { handleInputChange, inputValues } = useCategoryForm();
  return (
    <>
      {submitMessage && submitMessage.message !== "" && (
        <Alert message={submitMessage.message} type={submitMessage.type} />
      )}
      <form
        onSubmit={handleSubmit}
        className="bg-(--color-primary) p-8 rounded-3xl max-w-3xl"
      >
        <div className="mb-2">
          <Input
            name="category"
            label="Category"
            handleInputChange={handleInputChange}
            inputValues={inputValues.category || ""}
          />
        </div>
        <div className="flex justify-between">
          <div className="mb-2 flex-1">
            <Input
              type="color"
              name="color"
              label="Color"
              sx="p-0 h-20 w-20"
              handleInputChange={handleInputChange}
              inputValues={inputValues.color || ""}
            />
          </div>
          {/* <div className="mb-2 flex-1">
            <Input name="icon" label="Icon" />
          </div> */}
        </div>
        <Submit isPending={isPending} />
      </form>
    </>
  );
};

export default Category;
