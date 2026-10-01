import { supabase } from "../services/supabase";
import type { Budget, BudgetInput } from "../types/budget";
import { isMonthKey } from "../utils/helpers";

interface BudgetRow {
  id: number;
  amount: number | string | null;
  category: number;
  month: string;
  created_at: string | null;
}

const COLUMNS = "id, amount, category, month, created_at";

const mapBudget = (row: BudgetRow): Budget => ({
  id: row.id,
  amount: Number(row.amount) || 0,
  categoryId: row.category,
  month: String(row.month).slice(0, 7),
  createdAt: row.created_at ?? "",
});

const toRow = (input: BudgetInput) => ({
  amount: Number(input.amount),
  category: Number(input.categoryId),
  month: `${input.month}-01`,
  slug: `${Number(input.categoryId)}_${input.month}`,
});

const validate = (input: BudgetInput) => {
  if (!input.categoryId) throw new Error("Please choose a category");
  if (!isMonthKey(input.month)) throw new Error("Please choose a month");
  if (!(Number(input.amount) > 0)) throw new Error("Amount must be greater than 0");
};

/** One budget per category per month. */
const assertNoDuplicate = async (
  uid: string,
  input: BudgetInput,
  excludeId?: number,
) => {
  let query = supabase
    .from("budgets")
    .select("id")
    .eq("user_id", uid)
    .eq("category", Number(input.categoryId))
    .eq("month", `${input.month}-01`)
    .limit(1);
  if (excludeId) query = query.neq("id", excludeId);

  const { data, error } = await query;
  if (error) throw error;
  if (data && data.length > 0) {
    throw new Error("A budget for this category and month already exists");
  }
};

export const getBudgetsForMonth = async (
  uid: string,
  month: string,
): Promise<Budget[]> => {
  const { data, error } = await supabase
    .from("budgets")
    .select(COLUMNS)
    .eq("user_id", uid)
    .eq("month", `${month}-01`)
    .order("amount", { ascending: false });

  if (error) throw new Error(`Unable to load budgets: ${error.message}`);
  return (data ?? []).map(mapBudget);
};

export const getBudgetById = async (uid: string, id: number) => {
  const { data, error } = await supabase
    .from("budgets")
    .select(COLUMNS)
    .eq("user_id", uid)
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(`Unable to load budget: ${error.message}`);
  if (!data) throw new Error("Budget not found");
  return mapBudget(data);
};

export const createBudget = async (uid: string, input: BudgetInput) => {
  validate(input);
  await assertNoDuplicate(uid, input);
  const { error } = await supabase
    .from("budgets")
    .insert({ ...toRow(input), user_id: uid });
  if (error) throw new Error(`Unable to create budget: ${error.message}`);
};

export const updateBudget = async (
  uid: string,
  id: number,
  input: BudgetInput,
) => {
  validate(input);
  await assertNoDuplicate(uid, input, id);
  const { error } = await supabase
    .from("budgets")
    .update(toRow(input))
    .eq("user_id", uid)
    .eq("id", id);
  if (error) throw new Error(`Unable to update budget: ${error.message}`);
};

export const deleteBudget = async (uid: string, id: number) => {
  const { error } = await supabase
    .from("budgets")
    .delete()
    .eq("user_id", uid)
    .eq("id", id);
  if (error) throw new Error(`Unable to delete budget: ${error.message}`);
};

/**
 * Copies every budget from `fromMonth` into `toMonth`, skipping categories
 * that already have a budget there. Returns how many were created.
 */
export const copyBudgets = async (
  uid: string,
  fromMonth: string,
  toMonth: string,
) => {
  const [source, target] = await Promise.all([
    getBudgetsForMonth(uid, fromMonth),
    getBudgetsForMonth(uid, toMonth),
  ]);
  const taken = new Set(target.map((b) => b.categoryId));
  const rows = source
    .filter((b) => !taken.has(b.categoryId))
    .map((b) => ({
      ...toRow({ categoryId: b.categoryId, amount: b.amount, month: toMonth }),
      user_id: uid,
    }));

  if (rows.length === 0) return 0;
  const { error } = await supabase.from("budgets").insert(rows);
  if (error) throw new Error(`Unable to copy budgets: ${error.message}`);
  return rows.length;
};
