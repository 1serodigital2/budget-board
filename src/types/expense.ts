import {
  DocumentData,
  QueryDocumentSnapshot,
  Timestamp,
} from "firebase/firestore";
import { AlertProps, HandleInputChangeProps } from "./FormTypes";

export interface ExpenseFilterProps extends HandleInputChangeProps {
  catData: object;
  handleFilterSubmit: (e: React.SubmitEvent) => void;
  handleFilterReset: () => void;
  filter: FilterProps;
  isPending: boolean;
}

export interface FilterProps {
  category?: string;
  dateRange?: DateRange;
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
  createdAt?: Timestamp;
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
  start: Date | null;
  end: Date | null;
}

export interface ExpensesResponse {
  expenses: ExpensesDetailTyps[];
  lastVisible: QueryDocumentSnapshot<DocumentData> | null;
  hasMore: boolean;
}

export interface ExpensesDetailTyps extends ExpenseProps {
  id: string;
}
