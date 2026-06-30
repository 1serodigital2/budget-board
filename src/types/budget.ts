import { HandleInputChangeProps } from "./FormTypes";
import { GetExpenseDetailsType } from "./expense";
import { CategoryProps } from "./category";

export interface BudgetInputType {
  category: number;
  amount: number;
  month: string;
}

export interface BudgetType {
  budgetDetail: BudgetInputType;
  uid: string;
}

export interface BudgetFormType extends HandleInputChangeProps {
  handleFormSubmit: (e: React.SyntheticEvent) => void;
  inputValue: BudgetInputType;
  isPending?: boolean;
}

export interface GetBudgetByIdType {
  uid: string;
  budgetId: number;
}

export interface UpdateBudgetType {
  uid: string;
  budgetId: number;
  budgetDetail: BudgetInputType;
}

export interface GetBudgetDetailsTypes {
  id: number;
  amount: number;
  category: number | string;
  month: string;
  createdAt: string;
  slug: string;
}

export interface BudgetTableTypes {
  budgets: GetBudgetDetailsTypes[];
  expenses: GetExpenseDetailsType[];
  categories: CategoryProps[];
  limit?: number;
  showTotal?: boolean;
}

export interface BudgetsObjTypes {
  budgets: GetBudgetDetailsTypes[];
}

export interface BudgetDataResponse {
  categoryName: string;
  categoryId: number;
  categorySlug: string | undefined;
  budget: number;
  spent: number;
  remaining: number;
  percentage: number;
  budgetMonth: string;
}
export interface BudgetTableResponseTypes {
  totalBudgetAmount: number;
  totalSpent: number;
  totalRemaining: number;
  budgetData: BudgetDataResponse[];
}

export interface BudgetVsCategoryTypes {
  month: string;
  budgets: GetBudgetDetailsTypes[];
  expenses: GetExpenseDetailsType[];
  categories: CategoryProps[];
}

export interface BudgetTableProps extends BudgetTableResponseTypes {
  showTotal?: boolean;
  hideMonth?: boolean;
  monthFilter: string;
}
