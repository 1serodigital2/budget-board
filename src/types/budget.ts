import { HandleInputChangeProps } from "./FormTypes";

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
