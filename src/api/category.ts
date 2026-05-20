import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import {
  AddCategoryType,
  GetCategoryType,
  UpdateCategoryType,
} from "../types/category";
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
        id: doc.id,
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

export const getCategoryById = async ({
  userId,
  categoryId,
}: GetCategoryType) => {
  try {
    if (!userId) {
      throw new Error("Unauthorized access");
    }
    if (!categoryId) {
      throw new Error("Missing category id");
    }
    const docSnap = await getDoc(
      doc(db, `users/${userId}/category`, categoryId),
    );
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: categoryId,
        category: data.category,
        color: data.color,
        createdAt: data.createdAt,
      };
    }
  } catch (error: any) {
    throw new Error("Failed to fetch category detail " + error);
  }
};

export const deleteCategory = async ({
  userId,
  categoryId,
}: GetCategoryType) => {
  try {
    await deleteDoc(doc(db, `users/${userId}/category`, categoryId));
  } catch (error) {
    throw new Error("Fatal error while deleting category " + error);
  }
};

export const updateCategory = async ({
  userId,
  catId,
  categoryDetail,
}: UpdateCategoryType) => {
  try {
    const eventRef = doc(db, `users/${userId}/category`, catId);

    await updateDoc(eventRef, {
      ...categoryDetail,
      createdAt: serverTimestamp(),
    });

    return true;
  } catch (error) {
    console.error("unable to update category", error);
    throw new Error("Error while updating category");
  }
};
