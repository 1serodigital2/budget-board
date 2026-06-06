import { Timestamp } from "firebase/firestore";
import { AlertProps, HandleInputChangeProps } from "./FormTypes";

export interface ExpenseFilterProps extends HandleInputChangeProps {
  catData: object;
  handleFilterSubmit: (e: React.SubmitEvent) => void;
  filter: FilterProps;
  isPending: boolean;
}

export interface FilterProps {
  category?: string;
  dateRange?: {};
}

export interface ExpenseFormData {
  amount: number;
  category: string;
  date: string;
  note?: string;
}

export interface ExpenseFormProps extends HandleInputChangeProps {
  handleFormSubmit: (e: React.SubmitEvent) => void;
  inputValues: ExpenseFormData;
  isPending: boolean;
  submitMessage: AlertProps;
}

export interface ExpenseProps {
  amount: number;
  category: string;
  date: Timestamp;
  note?: string;
  createdAt?: string;
}

export interface GetExpenseDetailsType {
  id: string;
  amount: number;
  category: string;
  date: Date;
}

export interface GetExpenseObjType {
  expenses?: GetExpenseDetailsType[];
}

export interface DateRange {
  start: Date;
  end: Date;
};