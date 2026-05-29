import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "../services/firebase";

import { BudgetType, GetBudgetByIdType } from "../types/budget";
import { getCategories } from "./category";

export const createBudget = async ({ budgetDetail, uid }: BudgetType) => {
  try {
    //check for duplicate budget
    const allBudgets = await getBudgets(uid);
    const docId = budgetDetail.category + "_" + budgetDetail.month;
    const finalDocid = docId.toLowerCase().trim();

    if (allBudgets && allBudgets.length > 0) {
      const duplicateBudget = allBudgets.find(
        (budget) => budget.slug === finalDocid,
      );

      console.log("finalDocid", finalDocid);
      console.log("duplicateBudget", duplicateBudget);

      if (duplicateBudget) {
        throw new Error("This budget already exist");
      }
    }

    //Add budget
    const docRef = await addDoc(collection(db, `users/${uid}/budgets`), {
      ...budgetDetail,
      slug: finalDocid,
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
        slug: data.slug,
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

export const getBudgetById = async ({ uid, budgetId }: GetBudgetByIdType) => {
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
      return budgetData;
    }
  } catch (error) {}
};

export const deleteBudgetById = async ({
  uid,
  budgetId,
}: GetBudgetByIdType) => {
  try {
    await deleteDoc(doc(db, `users/${uid}/budgets`, budgetId));
  } catch (error: any) {
    throw new Error("Fatal error while deleting budget" + error);
  }
};
