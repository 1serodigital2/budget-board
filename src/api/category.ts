import { supabase } from "../services/supabase";
import type { Category, CategoryInput } from "../types/category";
import { normalizeName, slugify } from "../utils/helpers";

interface CategoryRow {
  id: number;
  name: string | null;
  color: string | null;
  slug: string | null;
  is_system: boolean | null;
  created_at: string | null;
}

const UNCATEGORIZED_SLUG = "uncategorized";

const mapCategory = (row: CategoryRow): Category => ({
  id: row.id,
  name: row.name?.trim() || "Untitled",
  color: row.color || "#64748b",
  slug: row.slug || "",
  isSystem: !!row.is_system,
  createdAt: row.created_at || "",
});

const STARTER_CATEGORIES: CategoryInput[] = [
  { name: "Food & Dining" },
  { name: "Groceries" },
  { name: "Transport" },
  { name: "Bills & Utilities" },
  { name: "Shopping" },
  { name: "Entertainment" },
  { name: "Health" },
];

/** Colours are assigned automatically; the same name always gets the same one. */
const AUTO_COLORS = [
  "#f97316", "#22c55e", "#3b82f6", "#a855f7", "#ec4899",
  "#eab308", "#14b8a6", "#ef4444", "#6366f1", "#06b6d4",
];
const UNCATEGORIZED_COLOR = "#64748b";

const autoColor = (name: string) => {
  let hash = 0;
  for (const char of normalizeName(name)) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return AUTO_COLORS[hash % AUTO_COLORS.length];
};

const toRow = (uid: string, input: CategoryInput, isSystem = false) => {
  const name = input.name.trim();
  return {
    user_id: uid,
    name,
    color: isSystem ? UNCATEGORIZED_COLOR : autoColor(name),
    normalized_name: normalizeName(name),
    slug: isSystem ? UNCATEGORIZED_SLUG : slugify(name),
    is_system: isSystem,
  };
};

/**
 * Every account needs a system "Uncategorized" category: deleting a category
 * moves its expenses there. Brand-new accounts also get a starter set.
 *
 * This runs on the first category fetch of a session instead of at sign-up,
 * because with email confirmation enabled there is no session at sign-up time
 * and row-level security rejects the insert.
 */
const ensuredUsers = new Map<string, Promise<void>>();

const ensureDefaultCategories = (uid: string) => {
  let pending = ensuredUsers.get(uid);
  if (!pending) {
    pending = (async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("slug, is_system")
        .eq("user_id", uid);
      if (error) throw error;

      const hasUncategorized = (data ?? []).some(
        (c) => c.is_system && c.slug === UNCATEGORIZED_SLUG,
      );
      const rows = [];
      if (!hasUncategorized) {
        rows.push(toRow(uid, { name: "Uncategorized" }, true));
      }
      if (!data || data.length === 0) {
        rows.push(...STARTER_CATEGORIES.map((c) => toRow(uid, c)));
      }
      if (rows.length > 0) {
        const { error: insertError } = await supabase
          .from("categories")
          .insert(rows);
        if (insertError) throw insertError;
      }
    })().catch((error) => {
      // Allow a retry on the next fetch.
      ensuredUsers.delete(uid);
      console.error("Unable to create default categories", error);
    });
    ensuredUsers.set(uid, pending);
  }
  return pending;
};

export const getCategories = async (uid: string): Promise<Category[]> => {
  await ensureDefaultCategories(uid);

  const { data, error } = await supabase
    .from("categories")
    .select("id, name, color, slug, is_system, created_at")
    .eq("user_id", uid)
    .order("is_system", { ascending: true })
    .order("name", { ascending: true });

  if (error) throw new Error(`Unable to load categories: ${error.message}`);
  return (data ?? []).map(mapCategory);
};

export const getCategoryById = async (
  uid: string,
  id: number,
): Promise<Category> => {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, color, slug, is_system, created_at")
    .eq("user_id", uid)
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(`Unable to load category: ${error.message}`);
  if (!data) throw new Error("Category not found");
  return mapCategory(data);
};

const assertNameAvailable = async (
  uid: string,
  name: string,
  excludeId?: number,
) => {
  let query = supabase
    .from("categories")
    .select("id")
    .eq("user_id", uid)
    .eq("normalized_name", normalizeName(name))
    .limit(1);
  if (excludeId) query = query.neq("id", excludeId);

  const { data, error } = await query;
  if (error) throw error;
  if (data && data.length > 0) {
    throw new Error(`A category named "${name.trim()}" already exists`);
  }
};

export const createCategory = async (uid: string, input: CategoryInput) => {
  if (!input.name.trim()) throw new Error("Category name is required");
  await assertNameAvailable(uid, input.name);

  const { data, error } = await supabase
    .from("categories")
    .insert(toRow(uid, input))
    .select("id")
    .single();

  if (error) throw new Error(`Unable to create category: ${error.message}`);
  return data.id as number;
};

export const updateCategory = async (
  uid: string,
  id: number,
  input: CategoryInput,
) => {
  if (!input.name.trim()) throw new Error("Category name is required");
  await assertNameAvailable(uid, input.name, id);

  const { name, normalized_name, slug } = toRow(uid, input);

  const { data, error } = await supabase
    .from("categories")
    .update({ name, normalized_name, slug })
    .eq("user_id", uid)
    .eq("id", id)
    .eq("is_system", false)
    .select("id");

  if (error) throw new Error(`Unable to update category: ${error.message}`);
  if (!data || data.length === 0) {
    throw new Error("System categories can't be edited");
  }
};

/**
 * Deleting a category moves its expenses to "Uncategorized" and removes the
 * budgets that were set for it (they no longer have anything to track).
 */
export const deleteCategory = async (uid: string, id: number) => {
  await ensureDefaultCategories(uid);

  const { data: fallback, error: fallbackError } = await supabase
    .from("categories")
    .select("id")
    .eq("user_id", uid)
    .eq("is_system", true)
    .eq("slug", UNCATEGORIZED_SLUG)
    .limit(1)
    .maybeSingle();

  if (fallbackError) throw fallbackError;
  if (!fallback) throw new Error("The Uncategorized category is missing");
  if (fallback.id === id) throw new Error("System categories can't be deleted");

  const { error: moveError } = await supabase
    .from("expenses")
    .update({ category: fallback.id })
    .eq("user_id", uid)
    .eq("category", id);
  if (moveError) {
    throw new Error(`Unable to move expenses: ${moveError.message}`);
  }

  const { error: budgetError } = await supabase
    .from("budgets")
    .delete()
    .eq("user_id", uid)
    .eq("category", id);
  if (budgetError) {
    throw new Error(`Unable to remove budgets: ${budgetError.message}`);
  }

  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("user_id", uid)
    .eq("id", id)
    .eq("is_system", false);
  if (error) throw new Error(`Unable to delete category: ${error.message}`);
};
