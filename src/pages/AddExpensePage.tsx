// react hooks
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

// tanstack
import { useMutation } from "@tanstack/react-query";

import Input from "../components/Input";

// types
import { ExpenseProps } from "../types/FormTypes";
import { createExpense, queryClient } from "../api/expenses";

const initialValues: ExpenseProps = {
  amount: 0,
  category: "",
  note: "",
};

const AddExpense = () => {
  const [inputValues, setInputValues] = useState(initialValues);
  const { user } = useAuth();

  const { mutate, isPending } = useMutation({
    mutationFn: createExpense,
    onSuccess: () => {
      setInputValues(initialValues);
      queryClient.invalidateQueries({
        queryKey: ["users"],
        refetchType: "none",
      });
    },

    onError: () => {
      console.error("Unable to add expense");
    },
  });

  const handleInputChange = (name: string, inputValue: string | number) => {
    console.log("name ", name);
    console.log("inputValue ", inputValue);
    if (!name || !inputValue) {
      console.error("Please fill up the form properly");
    }
    setInputValues((prevState) => {
      return {
        ...prevState,
        [name]: inputValue,
      };
    });
  };

  const handleFormSubmit = (e: React.SubmitEvent) => {
    try {
      e.preventDefault();

      const amount = inputValues.amount || 0;
      const category = inputValues.category?.toString() || "";
      const note = inputValues.note?.toString() || "";

      if (amount <= 0) {
        console.warn("Please enter amount");
        return;
      }
      const expenseDetail = {
        amount,
        category,
        note,
      };

      mutate({ uid: user.uid, expenseDetail });
    } catch (error) {
      console.error("Unable to add", error);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-medium mb-4">Add Expense</h1>
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
        <button className="bg-[#1e3a8a] p-3 text-white rounded-xl cursor-pointer">
          {isPending ? "Submitting" : "Submit"}
        </button>
      </form>
    </>
  );
};

export default AddExpense;
