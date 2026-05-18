import {
  addDoc,
  collection,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
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

export const getCategories = async (userId: string) => {
  try {
    if (!userId) {
      throw new Error("User id is required");
    }
    const querySnapshot = await getDocs(
      collection(db, `users/${userId}/category`),
    );

    const categories = querySnapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        name: data.category,
        color: data.color,
        createdAt: data.createdAt,
      };
    });

    return categories;
  } catch (error: any) {
    console.error("Unable to get categories", error);
    throw new Error("Unable to get categories");
  }
};
