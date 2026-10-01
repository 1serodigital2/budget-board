import type { ExpenseFilters } from "../types/expense";

/**
 * Every key starts with the resource name, then the user id, so that
 * invalidating ["expenses"] refreshes every expense query and data from one
 * account is never served to another.
 */
export const queryKeys = {
  categories: (uid: string) => ["categories", uid] as const,
  category: (uid: string, id: number) =>
    ["categories", uid, "detail", id] as const,

  expenseList: (uid: string, filters: ExpenseFilters) =>
    ["expenses", uid, "list", filters] as const,
  expense: (uid: string, id: number) => ["expenses", uid, "detail", id] as const,
  expenseRange: (uid: string, start: string, endExclusive: string) =>
    ["expenses", uid, "range", start, endExclusive] as const,

  budgetsForMonth: (uid: string, month: string) =>
    ["budgets", uid, "month", month] as const,
  budget: (uid: string, id: number) => ["budgets", uid, "detail", id] as const,

  trend: (uid: string, months: number) => ["trend", uid, months] as const,
};
