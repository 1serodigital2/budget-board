import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../services/firebase";

import { BudgetType } from "../types/budget";
import { getCategories } from "./category";

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

export const getBudgets = async (uid: string) => {
  try {
    const categories = await getCategories(uid);

    const querySnapshot = await getDocs(collection(db, `users/${uid}/budgets`));

    const budgets = querySnapshot.docs.map((doc) => {
      const data = doc.data();

      const matchedCategory = categories.find(
        (category) => category.id === data.category,
      );

      return {
        id: doc.id,
        amount: data.amount,
        category: matchedCategory?.name || "",
        month: data.month,
        createdAt: data.createdAt,
      };
    });

    return budgets;
  } catch (error: any) {
    console.error("Unable to fetch budgets", error);
    throw new Error("Unable to fetch budgets " + error);
  }
};

export const getBudgetById = async ({ uid, budgetId }) => {
  try {
    const docSnap = await getDoc(doc(db, `users/${uid}/budgets`, budgetId));

    if (docSnap.exists()) {
      const data = docSnap.data();
      const budgetData = {
        id: budgetId,
        amount: data.amount,
        category: data.category,
        month: data.month,
      };
      console.log("getBudgetById", budgetData);
      return budgetData;
    }
  } catch (error) {}
};
