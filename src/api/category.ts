import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  updateDoc,
  where,
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
    const normalizedName = categoryDetail.category.trim().toLowerCase();

    const categoryRef = collection(db, `users/${userId}/category`);
    const q = query(categoryRef, where("normalizedName", "==", normalizedName));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      throw new Error("Category already exists");
    }

    const slug = normalizedName.replace(/\s+/g, "-");

    const docRef = await addDoc(collection(db, `users/${userId}/category`), {
      ...categoryDetail,
      normalizedName,
      slug,
      isSystem: false,
      createdAt: serverTimestamp(),
    });
    if (!docRef?.id) {
      throw new Error("Failed to create category");
    }
  } catch (error: any) {
    throw new Error(error);
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
        isSystem: data.isSystem || false,
        slug: data.slug || "",
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
    // Find uncategorized category
    const categoryRef = collection(db, `users/${userId}/category`);

    const uncategorizedQuery = query(
      categoryRef,
      where("isSystem", "==", true),
      where("slug", "==", "uncategorized"),
      limit(1),
    );

    const uncategorizedSnapshot = await getDocs(uncategorizedQuery);

    if (uncategorizedSnapshot.empty) {
      throw new Error("Uncategorized category not found");
    }

    const uncategorizedCategory = uncategorizedSnapshot.docs[0];

    const uncategorizedId = uncategorizedCategory.id;

    // Find expenses using this category
    const expenseRef = collection(db, `users/${userId}/expenses`);

    const expenseQuery = query(expenseRef, where("category", "==", categoryId));

    const expenseSnapshot = await getDocs(expenseQuery);

    // Update all matched expenses
    const updatePromises = expenseSnapshot.docs.map((expenseDoc) =>
      updateDoc(expenseDoc.ref, {
        category: uncategorizedId,
      }),
    );

    await Promise.all(updatePromises);

    // Delete category
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
    const normalizedName = categoryDetail.category.trim().toLowerCase();
    const slug = normalizedName.replace(/\s+/g, "-");

    const eventRef = doc(db, `users/${userId}/category`, catId);

    await updateDoc(eventRef, {
      ...categoryDetail,
      normalizedName,
      slug,
      createdAt: serverTimestamp(),
    });

    return true;
  } catch (error) {
    console.error("unable to update category", error);
    throw new Error("Error while updating category");
  }
};

export const createDefaultCategories = async (uid: string) => {
  try {
    const defaultCategories = [
      {
        category: "Uncategorized",
        normalizedName: "uncategorized",
        slug: "uncategorized",
        isSystem: true,
        color: "#6b7280",
        createdAt: serverTimestamp(),
      },
      {
        category: "Food",
        normalizedName: "food",
        slug: "food",
        isSystem: true,
        color: "#ef4444",
        createdAt: serverTimestamp(),
      },
    ];

    await Promise.all(
      defaultCategories.map((category) =>
        addDoc(collection(db, `users/${uid}/category`), category),
      ),
    );
  } catch (error: any) {
    console.error("Unable to create default categories " + error);
  }
};

export const getCategoryMonthYear = ({
  uid,
  monthYear,
}: {
  uid: string;
  monthYear: string;
}) => {
  try {
    const categoryRef = collection(db, `users/${uid}/category`);
  } catch (error) {}
};
