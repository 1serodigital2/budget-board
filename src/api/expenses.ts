import { supabase } from "../services/supabase";
import {
  DateRange,
  ExpenseProps,
  GetExpenseDetailsType,
  MonthlyExpenseSummaryResponseType,
} from "../types/expense";
import {
  DateFilter,
  getMonthRange,
  getTimeStampFromMonth,
} from "../utils/helpers";
import { getBudgets } from "./budget";

interface CreateExpenseProp {
  uid: string;
  expenseDetail: ExpenseProps;
}
export const createExpense = async ({
  uid,
  expenseDetail,
}: CreateExpenseProp) => {
  try {
    if (!uid) {
      throw new Error("Uid is missing");
    }
    const { error } = await supabase.from("expenses").insert({
      user_id: uid,
      amount: expenseDetail.amount,
      category: expenseDetail.category,
      date: expenseDetail.date,
      note: expenseDetail.note,
      is_system: false,
    });

    if (error) throw error;
  } catch (error: any) {
    throw new Error("Unable to add expense: " + error.message);
  }
};

export const getExpenses = async (
  uid: string,
  category?: number,
  dateRange?: DateRange,
  pageOffset: number = 0,
  pageSize: number = 10,
) => {
  let query = supabase.from("expenses").select("*").eq("user_id", uid);

  if (category) {
    query = query.eq("category", category);
  }

  if (dateRange?.start && !dateRange?.end) {
    query = query.eq("date", dateRange.start.toISOString());
  } else if (dateRange?.start && dateRange?.end) {
    query = query.gte("date", dateRange.start.toISOString());
    query = query.lte("date", dateRange.end.toISOString());
  }

  query = query.order("date", { ascending: false });

  // PostgREST pagination (inclusive)
  query = query.range(pageOffset, pageOffset + pageSize - 1);

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  const expensesData = (data || []).map((doc: any) => ({
    id: doc.id,
    amount: doc.amount,
    category: doc.category,
    note: doc.note,
    date: doc.date,
    createdAt: doc.created_at,
  }));

  return {
    expenses: expensesData,
    lastVisible:
      data && data.length === pageSize ? pageOffset + data.length : null,
    hasMore: data && data.length === pageSize,
  };
};

interface deleteExpenseType {
  id: number;
  uid: string;
}
export const deleteExpense = async ({ id, uid }: deleteExpenseType) => {
  try {
    const { error } = await supabase
      .from("expenses")
      .delete()
      .eq("user_id", uid)
      .eq("id", id);

    if (error) throw error;
  } catch (error: any) {
    console.error("Unable to delete expense", error);
    throw new Error("Unable to delete expense: " + error.message);
  }
};

interface GetExpenseByIdType {
  uid?: string;
  id: number;
}

export const getExpenseById = async ({ uid, id }: GetExpenseByIdType) => {
  try {
    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .eq("user_id", uid)
      .eq("id", id)
      .single();

    if (error) throw error;

    if (data) {
      return {
        id,
        amount: data.amount,
        category: data.category,
        date: data.date || "",
        note: data.note,
        createdAt: data.created_at || "",
      };
    }
  } catch (error: any) {
    console.error("Unable to get expense detail", error);
    throw new Error("Unable to get expense detail: " + error.message);
  }
};

interface UpdateExpenseData {
  expId: number;
  expenseDetail: ExpenseProps;
  uid: string;
}
export const updateExpense = async ({
  uid,
  expId,
  expenseDetail,
}: UpdateExpenseData) => {
  try {
    const { error } = await supabase
      .from("expenses")
      .update({
        amount: expenseDetail.amount,
        category: expenseDetail.category,
        date: expenseDetail.date,
        note: expenseDetail.note,
      })
      .eq("user_id", uid)
      .eq("id", expId);

    if (error) throw error;
    return true;
  } catch (error: any) {
    console.error("unable to update expense", error);
    throw new Error("Error while updating expense " + error.message);
  }
};

export const getExpensesMonthYear = async ({
  uid,
  monthYear,
}: {
  uid: string;
  monthYear: string;
}): Promise<GetExpenseDetailsType[]> => {
  try {
    console.log("[getExpensesMonthYear] monthYear", monthYear);

    const { startDate, endDate } = getTimeStampFromMonth(monthYear);

    console.log("[getExpensesMonthYear] startDate", startDate);
    console.log("[getExpensesMonthYear] endDate", endDate);

    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .eq("user_id", uid)
      .gte("date", startDate)
      .lt("date", endDate);

    console.log("[getExpenseMonthYear] ", data);

    if (error) throw error;

    if (!data || data.length <= 0) {
      return [];
    }

    return data.map((doc: any) => ({
      id: doc.id,
      amount: doc.amount,
      category: doc.category,
      date: new Date(doc.date),
    }));
  } catch (error: any) {
    throw new Error("Unable to get expense for month year " + error.message);
  }
};

export const getMonthlyExpenses = async (
  uid: string,
  filter: DateFilter,
): Promise<MonthlyExpenseSummaryResponseType[]> => {
  const range = getMonthRange(filter);

  let query = supabase.from("expenses").select("*").eq("user_id", uid);

  if (filter !== "all-time" && range) {
    const { startDate } = getTimeStampFromMonth(range.startMonth);
    const { endDate } = getTimeStampFromMonth(range.endMonth);
    query = query.gte("date", startDate).lt("date", endDate);
  }

  const expensesRes = await query;
  const budgets = await getBudgets(uid, filter);

  if (expensesRes.error) {
    throw expensesRes.error;
  }

  const monthlyData: Record<
    string,
    {
      expense: number;
      budget: number;
      sortDate: Date;
    }
  > = {};

  // Budgets
  budgets.forEach((budget) => {
    const [year, month] = budget.month.split("-").map(Number);
    const date = new Date(year, month - 1, 1);
    const monthKey = date.toLocaleString("en-US", {
      month: "short",
      year: "numeric",
    });

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = {
        expense: 0,
        budget: 0,
        sortDate: date,
      };
    }

    monthlyData[monthKey].budget += Number(budget.amount);
  });

  // Expenses
  (expensesRes.data || []).forEach((expense: any) => {
    const date = new Date(expense.date);
    const monthKey = date.toLocaleString("en-US", {
      month: "short",
      year: "numeric",
    });

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = {
        expense: 0,
        budget: 0,
        sortDate: new Date(date.getFullYear(), date.getMonth(), 1),
      };
    }

    monthlyData[monthKey].expense += Number(expense.amount);
  });

  return Object.entries(monthlyData)
    .sort(([, a], [, b]) => a.sortDate.getTime() - b.sortDate.getTime())
    .map(([month, data]) => ({
      month,
      expense: data.expense,
      budget: data.budget,
    }));
};
