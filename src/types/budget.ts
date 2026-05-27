import { HandleInputChangeProps } from "./FormTypes";

export interface BudgetFormComponentType {
  category: string;
  amount: number;
  month: string;
}

export interface BudgetType {
  budgetDetail: BudgetFormComponentType;
  uid: string;
}

export interface BudgetFormType extends HandleInputChangeProps {
  handleFormSubmit: (e: React.SubmitEvent) => void;
  data: object;
  inputValue: string | number;
  isPending?: boolean;
  category: string;
}
