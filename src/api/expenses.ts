import { supabase } from "../services/supabase";
import type {
  Expense,
  ExpenseFilters,
  ExpenseInput,
  ExpensePage,
  MonthlyTrendPoint,
} from "../types/expense";
import {
  addDays,
  currentMonthKey,
  formatMonth,
  monthBounds,
  shiftMonth,
} from "../utils/helpers";

interface ExpenseRow {
  id: number;
  amount: number | string | null;
  category: number;
  note: string | null;
  date: string | null;
  created_at: string | null;
}

const COLUMNS = "id, amount, category, note, date, created_at";
export const EXPENSE_PAGE_SIZE = 20;

const mapExpense = (row: ExpenseRow): Expense => ({
  id: row.id,
  amount: Number(row.amount) || 0,
  categoryId: row.category,
  note: row.note ?? "",
  // `date` may come back as "YYYY-MM-DD" or a full timestamp; keep the day.
  date: (row.date || row.created_at || "").slice(0, 10),
  createdAt: row.created_at ?? "",
});

const toRow = (input: ExpenseInput) => ({
  amount: Number(input.amount),
  category: Number(input.categoryId),
  date: input.date,
  note: input.note.trim(),
});

const validate = (input: ExpenseInput) => {
  if (!(Number(input.amount) > 0)) throw new Error("Amount must be greater than 0");
  if (!input.categoryId) throw new Error("Please choose a category");
  if (!input.date) throw new Error("Please choose a date");
};

export const getExpenses = async (
  uid: string,
  filters: ExpenseFilters,
  offset = 0,
): Promise<ExpensePage> => {
  let query = supabase
    .from("expenses")
    .select(COLUMNS, { count: "exact" })
    .eq("user_id", uid);

  if (filters.categoryId) query = query.eq("category", filters.categoryId);
  if (filters.search?.trim()) {
    const term = filters.search.trim().replace(/[\\%_]/g, (c) => `\\${c}`);
    query = query.ilike("note", `%${term}%`);
  }
  if (filters.from) query = query.gte("date", filters.from);
  // `to` is inclusive; compare against the start of the following day so the
  // whole last day is included whether `date` is a date or a timestamp column.
  if (filters.to) query = query.lt("date", addDays(filters.to, 1));

  const { data, error, count } = await query
    .order("date", { ascending: false })
    .order("id", { ascending: false })
    .range(offset, offset + EXPENSE_PAGE_SIZE - 1);

  if (error) throw new Error(`Unable to load expenses: ${error.message}`);

  const expenses = (data ?? []).map(mapExpense);
  const total = count ?? expenses.length;
  const loaded = offset + expenses.length;

  return {
    expenses,
    total,
    nextOffset: loaded < total && expenses.length > 0 ? loaded : null,
  };
};

export const getExpensesInRange = async (
  uid: string,
  start: string,
  endExclusive: string,
): Promise<Expense[]> => {
  const { data, error } = await supabase
    .from("expenses")
    .select(COLUMNS)
    .eq("user_id", uid)
    .gte("date", start)
    .lt("date", endExclusive)
    .order("date", { ascending: false })
    .order("id", { ascending: false });

  if (error) throw new Error(`Unable to load expenses: ${error.message}`);
  return (data ?? []).map(mapExpense);
};

export const getExpenseById = async (uid: string, id: number) => {
  const { data, error } = await supabase
    .from("expenses")
    .select(COLUMNS)
    .eq("user_id", uid)
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(`Unable to load expense: ${error.message}`);
  if (!data) throw new Error("Expense not found");
  return mapExpense(data);
};

export const createExpense = async (uid: string, input: ExpenseInput) => {
  validate(input);
  const { error } = await supabase
    .from("expenses")
    .insert({ ...toRow(input), user_id: uid, is_system: false });
  if (error) throw new Error(`Unable to add expense: ${error.message}`);
};

export const updateExpense = async (
  uid: string,
  id: number,
  input: ExpenseInput,
) => {
  validate(input);
  const { error } = await supabase
    .from("expenses")
    .update(toRow(input))
    .eq("user_id", uid)
    .eq("id", id);
  if (error) throw new Error(`Unable to update expense: ${error.message}`);
};

export const deleteExpense = async (uid: string, id: number) => {
  const { error } = await supabase
    .from("expenses")
    .delete()
    .eq("user_id", uid)
    .eq("id", id);
  if (error) throw new Error(`Unable to delete expense: ${error.message}`);
};

/**
 * Spend and total budget for each of the last `months` months, ending with
 * the current month. Months with no activity are included as zeros so the
 * chart has no gaps.
 */
export const getMonthlyTrend = async (
  uid: string,
  months: number,
): Promise<MonthlyTrendPoint[]> => {
  const lastMonth = currentMonthKey();
  const firstMonth = shiftMonth(lastMonth, -(months - 1));
  const { start } = monthBounds(firstMonth);
  const { endExclusive } = monthBounds(lastMonth);

  const [expensesRes, budgetsRes] = await Promise.all([
    supabase
      .from("expenses")
      .select("amount, date, created_at")
      .eq("user_id", uid)
      .gte("date", start)
      .lt("date", endExclusive),
    supabase
      .from("budgets")
      .select("amount, month")
      .eq("user_id", uid)
      .gte("month", start)
      .lt("month", endExclusive),
  ]);

  if (expensesRes.error) throw new Error(expensesRes.error.message);
  if (budgetsRes.error) throw new Error(budgetsRes.error.message);

  const points = new Map<string, MonthlyTrendPoint>();
  for (let i = 0; i < months; i++) {
    const month = shiftMonth(firstMonth, i);
    points.set(month, {
      month,
      label: formatMonth(month, "short"),
      expense: 0,
      budget: 0,
    });
  }

  for (const row of expensesRes.data ?? []) {
    const month = String(row.date || row.created_at || "").slice(0, 7);
    const point = points.get(month);
    if (point) point.expense += Number(row.amount) || 0;
  }
  for (const row of budgetsRes.data ?? []) {
    const point = points.get(String(row.month).slice(0, 7));
    if (point) point.budget += Number(row.amount) || 0;
  }

  return [...points.values()];
};
