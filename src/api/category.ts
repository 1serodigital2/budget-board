import { supabase } from "../services/supabase";
import {
  AddCategoryType,
  CategoryProps,
  GetCategoryType,
  UpdateCategoryType,
} from "../types/category";

export const addCategory = async ({
  userId,
  categoryDetail,
}: AddCategoryType) => {
  try {
    const normalized_name = categoryDetail.name.trim().toLowerCase();
    const slug = normalized_name.replace(/\s+/g, "-");

    // Check if category exists
    const { data: existing } = await supabase
      .from("categories")
      .select("id")
      .eq("user_id", userId)
      .eq("normalized_name", normalized_name);

    if (existing && existing.length > 0) {
      throw new Error("Category already exists");
    }

    const { error } = await supabase.from("categories").insert({
      user_id: userId,
      name: categoryDetail.name,
      color: categoryDetail.color,
      normalized_name,
      slug,
      is_system: false,
    });

    if (error) {
      throw new Error("Failed to create category: " + error.message);
    }
  } catch (error: any) {
    throw new Error(error.message || error);
  }
};

export const getCategories = async (
  userId: string,
): Promise<CategoryProps[]> => {
  // console.log("getCategories triggered", userId);
  console.log("userId type:", typeof userId, "value:", JSON.stringify(userId));
  try {
    if (!userId) {
      throw new Error("User id is required");
    }

    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("user_id", userId)
      .order("name", { ascending: true });

    console.log("cat data", data);

    if (error) {
      throw error;
    }

    return (data || []).map((cat: any) => ({
      id: cat.id,
      name: cat.name,
      color: cat.color,
      createdAt: cat.created_at,
      isSystem: cat.is_system || false,
      slug: cat.slug || "",
    }));
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

    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("user_id", userId)
      .eq("id", categoryId)
      .single();

    if (error) {
      throw error;
    }

    if (data) {
      return {
        id: data.id,
        name: data.name,
        color: data.color,
        createdAt: data.created_at,
      };
    }
  } catch (error: any) {
    throw new Error("Failed to fetch category detail " + error.message);
  }
};

export const deleteCategory = async ({
  userId,
  categoryId,
}: GetCategoryType) => {
  try {
    // Find uncategorized category
    const { data: uncategorized, error: uncatError } = await supabase
      .from("categories")
      .select("id")
      .eq("user_id", userId)
      .eq("is_system", true)
      .eq("slug", "uncategorized")
      .single();

    if (uncatError || !uncategorized) {
      throw new Error("Uncategorized category not found");
    }

    const uncategorizedId = uncategorized.id;

    // Update all matched expenses
    const { error: updateError } = await supabase
      .from("expenses")
      .update({ category: uncategorizedId })
      .eq("user_id", userId)
      .eq("category", categoryId);

    if (updateError) {
      throw new Error("Failed to reassign expenses: " + updateError.message);
    }

    // Delete category
    const { error: deleteError } = await supabase
      .from("categories")
      .delete()
      .eq("user_id", userId)
      .eq("id", categoryId);

    if (deleteError) {
      throw deleteError;
    }
  } catch (error: any) {
    throw new Error("Fatal error while deleting category " + error.message);
  }
};

export const updateCategory = async ({
  userId,
  catId,
  categoryDetail,
}: UpdateCategoryType) => {
  try {
    const normalized_name = categoryDetail.name.trim().toLowerCase();
    const slug = normalized_name.replace(/\s+/g, "-");

    const { error } = await supabase
      .from("categories")
      .update({
        name: categoryDetail.name,
        color: categoryDetail.color,
        normalized_name,
        slug,
      })
      .eq("user_id", userId)
      .eq("id", catId);

    if (error) {
      throw error;
    }

    return true;
  } catch (error: any) {
    console.error("unable to update category", error);
    throw new Error("Error while updating category: " + error.message);
  }
};

export const createDefaultCategories = async (uid: string) => {
  try {
    const defaultCategories = [
      {
        user_id: uid,
        category: "Uncategorized",
        normalized_name: "uncategorized",
        slug: "uncategorized",
        is_system: true,
        color: "#6b7280",
      },
      {
        user_id: uid,
        category: "Food",
        normalized_name: "food",
        slug: "food",
        is_system: true,
        color: "#ef4444",
      },
    ];

    const { error } = await supabase
      .from("categories")
      .insert(defaultCategories);

    if (error) {
      throw error;
    }
  } catch (error: any) {
    console.error("Unable to create default categories " + error.message);
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
    // left unimplemented as in original code
  } catch (error) {}
};
