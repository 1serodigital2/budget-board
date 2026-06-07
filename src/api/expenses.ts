import { QueryClient } from "@tanstack/react-query";
import {
  addDoc,
  doc,
  collection,
  serverTimestamp,
  getDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  where,
  query,
  Timestamp,
} from "firebase/firestore";
import { db } from "../services/firebase";
import {
  DateRange,
  ExpenseFormData,
  ExpenseProps,
  GetExpenseDetailsType,
} from "../types/expense";
import { getTimeStampFromMonth } from "../utils/helpers";

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
    if (!uid) {
      throw new Error("Uid is missing");
    }
    const docRef = await addDoc(collection(db, `users/${uid}/expenses`), {
      ...expenseDetail,
      isSystem: false,
      createdAt: serverTimestamp(),
    });
    console.log("doc refid", docRef.id);
  } catch (error: any) {
    throw new Error("Unable to add expense" + error);
  }
};

export const getExpenses = async (
  uid: string,
  category?: string,
  dateRange?: DateRange,
): Promise<(ExpenseProps & { id: string })[]> => {
  const collectionRef = collection(db, `users/${uid}/expenses`);

  const constraints = [];

  if (category) {
    constraints.push(where("category", "==", category));
  }

  if (dateRange?.start && !dateRange?.end) {
    constraints.push(where("date", "==", dateRange.start));
  } else if (dateRange?.start && dateRange?.end) {
    constraints.push(where("date", ">=", dateRange.start));
    constraints.push(where("date", "<=", dateRange.end));
  }

  const q = query(collectionRef, ...constraints);

  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as (ExpenseProps & { id: string })[];
};
interface deleteExpenseType {
  id: string;
  uid: string;
}
export const deleteExpense = async ({ id, uid }: deleteExpenseType) => {
  console.log("deleteExpense request expense id", id);
  console.log("deleteExpense request user id", uid);

  try {
    const response = await deleteDoc(doc(db, `users/${uid}/expenses`, id));
    console.log("delete expense resposne", response);
  } catch (error: any) {
    console.error("Unablet to delete expense", error);
    throw new Error("Unable to delete expense" + error);
  }
};

interface GetExpenseByIdType {
  uid?: string;
  id: string;
}

export const getExpenseById = async ({ uid, id }: GetExpenseByIdType) => {
  console.log("getExpense uid", uid);
  console.log("getExpense id", id);
  try {
    const docSnap = await getDoc(doc(db, `users/${uid}/expenses`, id));
    if (docSnap.exists()) {
      const data = docSnap.data();
      const expenseData = {
        id,
        amount: data.amount,
        category: data.category,
        date: data.date || "",
        note: data.note,
        createdAt: data.createdAt || "",
      };

      console.log("expenseData", expenseData);
      return expenseData;
    }
  } catch (error: any) {
    console.error("Unable to get expense detail", error);
    throw new Error("Unable to get expense detail" + error);
  }
};

interface UpdateExpenseData {
  expId: string;
  expenseDetail: ExpenseProps;
  uid: string;
}
export const updateExpense = async ({
  uid,
  expId,
  expenseDetail,
}: UpdateExpenseData) => {
  try {
    const eventRef = doc(db, `users/${uid}/expenses`, expId);

    await updateDoc(eventRef, {
      ...expenseDetail,
      createdAt: serverTimestamp(),
    });

    return true;
  } catch (error) {
    console.error("unable to update expense", error);
    throw new Error("Error while updating expense " + error);
  }
};

export const getExpensesMonthYear = async ({
  uid,
  monthYear,
}: {
  uid: string;
  monthYear: string;
}) => {
  try {
    const { startDate, endDate } = getTimeStampFromMonth(monthYear);

    console.log("startDate", startDate);
    console.log("endDate", endDate);

    const expensesRef = collection(db, `users/${uid}/expenses`);
    const q = query(
      expensesRef,
      where("date", ">=", startDate),
      where("date", "<", endDate),
    );

    const expensesSnap = await getDocs(q);
    if (expensesSnap.docs.length <= 0) {
      return [];
    }
    const expensesData = expensesSnap.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        amount: data.amount,
        category: data.category,
        date: data.date.toDate(),
      };
    });

    console.log("getExpensesMonthYear", expensesData);

    return expensesData;
  } catch (error) {
    throw new Error("Unable to get expense for month year " + error);
  }
};
