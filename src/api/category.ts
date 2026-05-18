import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { AddCategoryType } from "../types/category";
import { db } from "../services/firebase";

export const addCategory = async ({
  userId,
  categoryDetail,
}: AddCategoryType) => {
  try {
    const docRef = await addDoc(collection(db, `users/${userId}/category`), {
      ...categoryDetail,
      createdAt: serverTimestamp(),
    });
    if (!docRef?.id) {
      throw new Error("Failed to create category");
    }
    console.log("doc refid", docRef.id);
  } catch (error: any) {
    throw new Error("Unable to add category", error);
  }
};
