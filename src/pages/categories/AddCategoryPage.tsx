// hooks
import { useState } from "react";

import Submit from "../../components/form/Submit";
import Input from "../../components/Input";

const AddCategoryPage = () => {
  // const [] = useState

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
        <div className="flex justify-between">
          <div className="mb-2 flex-1">
            <Input type="color" name="color" label="Color" sx="p-0 h-20 w-20" />
          </div>
          <div className="mb-2 flex-1">
            <Input name="icon" label="Icon" />
          </div>
        </div>
        <Submit />
      </form>
    </>
  );
};

export default AddCategoryPage;
