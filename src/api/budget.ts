import { supabase } from "../services/supabase";

import {
  BudgetType,
  GetBudgetByIdType,
  GetBudgetDetailsTypes,
  UpdateBudgetType,
} from "../types/budget";
import { getCategories } from "./category";
import {
  addDateInMonth,
  DateFilter,
  formatMonth,
  getMonthRange,
} from "../utils/helpers";

export const createBudget = async ({ budgetDetail, uid }: BudgetType) => {
  try {
    const finalDocid = normalizeBudgetSlug(
      budgetDetail.category.toString(),
      budgetDetail.month,
    );

    // check for duplicate budget
    const { data: duplicateBudget } = await supabase
      .from("budgets")
      .select("id")
      .eq("user_id", uid)
      .eq("slug", finalDocid)
      .eq("month", addDateInMonth(budgetDetail.month, "-01"))
      .single();

    if (duplicateBudget) {
      throw new Error("This budget already exist");
    }

    // Add budget
    const { error } = await supabase.from("budgets").insert({
      user_id: uid,
      amount: budgetDetail.amount,
      category: budgetDetail.category,
      month: budgetDetail.month + "-01",
      slug: finalDocid,
    });

    if (error) {
      throw error;
    }
  } catch (error: any) {
    throw new Error("Unable to create budget: " + error.message);
  }
};

export const getBudgets = async (uid: string, filter?: DateFilter) => {
  try {
    console.log("[getBudgets] filter", filter);

    const categories = await getCategories(uid);

    let query = supabase
      .from("budgets")
      .select("*")
      .eq("user_id", uid)
      .order("month", { ascending: false });

    if (filter && filter !== "all-time") {
      const range = getMonthRange(filter);
      if (range) {
        query = query
          .gte("month", range.startDate)
          .lte("month", range.endDate);
      }
    }

    const { data, error } = await query;

    console.log("[getBudgets] Debug budgets", data);

    if (error) {
      throw error;
    }

    return (data || []).map((budget: any) => {
      const matchedCategory = categories.find(
        (category) => category.id === budget.category,
      );

      return {
        id: budget.id,
        slug: budget.slug,
        amount: budget.amount,
        category: matchedCategory?.name || "",
        month: budget.month,
        createdAt: budget.created_at,
      };
    });
  } catch (error: any) {
    console.error("Unable to fetch budgets", error);
    throw error;
  }
};

export const getBudgetById = async ({ uid, budgetId }: GetBudgetByIdType) => {
  try {
    const { data, error } = await supabase
      .from("budgets")
      .select("*")
      .eq("user_id", uid)
      .eq("id", budgetId)
      .single();

    if (error) {
      throw error;
    }

    if (data) {
      return {
        id: budgetId,
        amount: data.amount,
        category: data.category,
        month: data.month,
      };
    }
  } catch (error) {}
};

export const deleteBudgetById = async ({
  uid,
  budgetId,
}: GetBudgetByIdType) => {
  try {
    const { error } = await supabase
      .from("budgets")
      .delete()
      .eq("user_id", uid)
      .eq("id", budgetId);

    if (error) throw error;
  } catch (error: any) {
    throw new Error("Fatal error while deleting budget" + error.message);
  }
};

export const getBudgetExceptCurrent = async ({
  uid,
  budgetId,
}: GetBudgetByIdType) => {
  const { data, error } = await supabase
    .from("budgets")
    .select("*")
    .eq("user_id", uid)
    .neq("id", budgetId);

  if (error) {
    throw error;
  }

  return (data || []).map((budget: any) => ({
    id: budget.id,
    category: budget.category,
    month: budget.month,
    slug: budget.slug,
  }));
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
        budget.month == budgetDetail.month + "-01",
    );

    if (isDuplicate) {
      throw new Error("Budget already exists for this category and month");
    }

    const budgetSlug = normalizeBudgetSlug(
      budgetDetail.category.toString(),
      budgetDetail.month,
    );

    const { error } = await supabase
      .from("budgets")
      .update({
        amount: budgetDetail.amount,
        category: budgetDetail.category,
        month: budgetDetail.month + "-01",
        slug: budgetSlug,
      })
      .eq("user_id", uid)
      .eq("id", budgetId);

    if (error) throw error;

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
}): Promise<GetBudgetDetailsTypes[]> => {
  try {
    console.log("[getBudgetMonthYear] budget monthYear", monthYear);

    const { data, error } = await supabase
      .from("budgets")
      .select("*")
      .eq("user_id", uid)
      .eq("month", monthYear);

    console.log("[getBudgetMonthYear] budget data", data);
    if (error) throw error;

    return (data || []).map((budget: any) => ({
      id: budget.id,
      amount: budget.amount,
      category: budget.category,
      month: budget.month,
      createdAt: budget.created_at,
      slug: budget.slug,
    }));
  } catch (error: any) {
    throw new Error("Failed to fetch budget for specific month");
  }
};
