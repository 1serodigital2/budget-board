import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../services/firebase";

import {
  BudgetType,
  GetBudgetByIdType,
  UpdateBudgetType,
} from "../types/budget";
import { getCategories } from "./category";

export const createBudget = async ({ budgetDetail, uid }: BudgetType) => {
  try {
    //check for duplicate budget
    const allBudgets = await getBudgets(uid);

    const finalDocid = normalizeBudgetSlug(
      budgetDetail.category,
      budgetDetail.month,
    );

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

export const getBudgetExceptCurrent = async ({
  uid,
  budgetId,
}: GetBudgetByIdType) => {
  const budgetsRef = collection(db, `users/${uid}/budgets`);

  const querySnapshot = await getDocs(budgetsRef);

  const budgetSnap = querySnapshot.docs.filter((doc) => doc.id !== budgetId);
  const budgetRef = budgetSnap.map((doc) => {
    const data = doc.data();

    return {
      id: doc.id,
      category: data.category,
      month: data.month,
      slug: data.slug,
    };
  });

  return budgetRef;
};

export const updateBudget = async ({
  uid,
  budgetId,
  budgetDetail,
}: UpdateBudgetType) => {
  try {
    const existingBudgets = await getBudgetExceptCurrent({
      uid,
      budgetId,
    });

    const isDuplicate = existingBudgets.some(
      (budget) =>
        budget.category === budgetDetail.category &&
        budget.month === budgetDetail.month,
    );

    if (isDuplicate) {
      throw new Error("Budget already exists for this category and month");
    }

    const budgetSlug = normalizeBudgetSlug(
      budgetDetail.category,
      budgetDetail.month,
    );

    const updatedBudgetDetail = {
      ...budgetDetail,
      slug: budgetSlug,
    };

    const budgetRef = doc(db, `users/${uid}/budgets`, budgetId);

    await updateDoc(budgetRef, { ...updatedBudgetDetail });

    return true;
  } catch (error: any) {
    throw error;
  }
};

const normalizeBudgetSlug = (category: string, month: string) => {
  const docId = category + "_" + month;
  const finalDocid = docId.toLowerCase().trim();
  return finalDocid;
};

export const getBudgetMonthYear = async ({
  monthYear,
  uid,
}: {
  monthYear: string;
  uid: string;
}) => {
  try {
    const budgetRef = collection(db, `users/${uid}/budgets`);
    const q = query(budgetRef, where("month", "==", monthYear));
    const budgetSnapshot = await getDocs(q);
    const budget = budgetSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        amount: data.amount,
        category: data.category,
        month: data.month,
        createdAt: data.createdAt,
        slug: data.slug,
      };
    });

    console.log("budget", budget);

    return budget;
  } catch (error) {
    throw new Error("Failed to fetch budget for specific month");
  }
};
