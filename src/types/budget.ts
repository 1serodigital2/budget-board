import { Timestamp } from "firebase/firestore";
import { HandleInputChangeProps } from "./FormTypes";
import { GetExpenseDetailsType } from "./expense";
import { CategoryProps } from "./category";

export interface BudgetInputType {
  category: string;
  amount: number;
  month: string;
}

export interface BudgetType {
  budgetDetail: BudgetInputType;
  uid: string;
}

export interface BudgetFormType extends HandleInputChangeProps {
  handleFormSubmit: (e: React.SubmitEvent) => void;
  inputValue: BudgetInputType;
  isPending?: boolean;
}

export interface GetBudgetByIdType {
  uid: string;
  budgetId: string;
}

export interface UpdateBudgetType {
  uid: string;
  budgetId: string;
  budgetDetail: BudgetInputType;
}

export interface GetBudgetDetailsTypes {
  id: string;
  amount: number;
  category: string;
  month: string;
  createdAt: Timestamp;
  slug: string;
}

export interface BudgetTableTypes {
  budgets: GetBudgetDetailsTypes[];
  expenses: GetExpenseDetailsType[];
  categories: CategoryProps[];
}
