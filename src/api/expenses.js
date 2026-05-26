import { QueryClient } from "@tanstack/react-query";
import { addDoc, doc, collection, serverTimestamp, getDoc, getDocs, deleteDoc, updateDoc, where, query, } from "firebase/firestore";
import { db } from "../services/firebase";
export const queryClient = new QueryClient();
export const createExpense = async ({ uid, expenseDetail, }) => {
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
    }
    catch (error) {
        throw new Error("Unable to add expense", error);
    }
};
export const getExpenses = async (uid, category, keyword) => {
    try {
        if (!uid) {
            throw new Error("Unauthorized access");
        }
        const collectionRef = collection(db, `users/${uid}/expenses`);
        const constraints = [];
        // category filter
        if (category) {
            constraints.push(where("category", "==", category));
        }
        const q = query(collectionRef, ...constraints);
        const querySnapshot = await getDocs(q);
        let expenses = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                amount: data.amount,
                category: data.category,
                note: data.note,
                createdAt: data.createdAt || "",
            };
        });
        // keyword filter
        if (keyword) {
            expenses = expenses.filter((expense) => expense.note?.toLowerCase().includes(keyword.toLowerCase()));
        }
        return expenses;
    }
    catch (error) {
        console.error("Unable to get expenses", error);
        throw new Error("Unable to get expenses");
    }
};
export const deleteExpense = async ({ id, uid }) => {
    console.log("deleteExpense request expense id", id);
    console.log("deleteExpense request user id", uid);
    try {
        const response = await deleteDoc(doc(db, `users/${uid}/expenses`, id));
        console.log("delete expense resposne", response);
    }
    catch (error) {
        console.error("Unablet to delete expense", error);
        throw new Error("Unable to delete expense", error);
    }
};
export const getExpenseById = async ({ uid, id }) => {
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
                note: data.note,
                createdAt: data.createdAt || "",
            };
            console.log("expenseData", expenseData);
            return expenseData;
        }
    }
    catch (error) {
        console.error("Unable to get expense detail", error);
        throw new Error("Unable to get expense detail", error);
    }
};
export const updateExpense = async ({ uid, expId, expenseDetail, }) => {
    try {
        const eventRef = doc(db, `users/${uid}/expenses`, expId);
        await updateDoc(eventRef, {
            ...expenseDetail,
            createdAt: serverTimestamp(),
        });
        return true;
    }
    catch (error) {
        console.error("unable to update expense", error);
        throw new Error("Error while updating expense");
    }
};
