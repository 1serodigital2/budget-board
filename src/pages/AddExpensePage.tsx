import { useState } from "react";

import Input from "../components/Input";

const AddExpense = () => {
  // const [inputValues, setInputValues] = useState();
  return (
    <>
      <h1 className="text-2xl font-medium mb-4">Add Expense</h1>
      <form
        action=""
        className="bg-(--color-primary) p-8 rounded-3xl max-w-3xl"
      >
        <div className="mb-2 5">
          <Input type="number" name="amount" label="Amount" required />
        </div>
        <div className="mb-2 5">
          <Input name="category" label="Category" required />
        </div>
        <div className="mb-2 5">
          <Input name="note" label="Short note" />
        </div>
        <button className="bg-[#1e3a8a] p-3 text-white rounded-xl cursor-pointer">
          Submit
        </button>
      </form>
    </>
  );
};

export default AddExpense;
