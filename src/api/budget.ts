import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../services/firebase";

import { BudgetType } from "../types/budget";

export const createBudget = async ({ budgetDetail, uid }: BudgetType) => {
  try {
    const docRef = await addDoc(collection(db, `users/${uid}/budgets`), {
      ...budgetDetail,
      createdAt: serverTimestamp(),
    });

    console.log("budget created id", docRef.id);
  } catch (error: any) {
    throw new Error("Unablet to create budget " + error);
  }
};
