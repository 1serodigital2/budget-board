import Submit from "../../components/form/Submit";
import Input from "../../components/Input";

const AddCategoryPage = () => {
  return (
    <>
      <h1>Add Category</h1>
      <form
        action=""
        className="bg-(--color-primary) p-8 rounded-3xl max-w-3xl"
      >
        <div className="mb-2">
          <Input name="category" label="Category" />
        </div>
        <Submit />
      </form>
    </>
  );
};

export default AddCategoryPage;
