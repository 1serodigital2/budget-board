import { CategoryFormProps } from "../../types/category";
import Input from "../Input";
import Alert from "../ui/Alert";
import Submit from "./Submit";

const Category = ({
  isPending,
  submitMessage,
  handleSubmit,
  handleInputChange,
  inputValues,
}: CategoryFormProps) => {
  return (
    <>
      {submitMessage && submitMessage.message !== "" && (
        <Alert message={submitMessage.message} type={submitMessage.type} />
      )}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 border rounded-lg max-w-xl"
      >
        <div className="mb-2">
          <Input
            name="name"
            label="Category"
            handleInputChange={handleInputChange}
            inputValues={inputValues.name || ""}
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
