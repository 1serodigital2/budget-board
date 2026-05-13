import { QueryClient } from "@tanstack/react-query";
import { addDoc, doc, collection } from "firebase/firestore";
import { db } from "../services/firebase";
import { ExpenseProps } from "../types/FormTypes";

export const queryClient = new QueryClient();

interface CreateExpenseProp {
  uid: string;
  expenseDetail: ExpenseProps;
}
export const createExpense = async ({
  uid,
  expenseDetail,
}: CreateExpenseProp) => {
  try {
    console.log("user id", uid)
    if (!uid) {
      throw new Error("Uid is missing");
    }
    const docRef = await addDoc(
      collection(db, `users/${uid}/expenses`),
      expenseDetail,
    );
    console.log("doc refid", docRef.id);
  } catch (error) {
    throw new Error("Unable to add expense", error);
  }
};
