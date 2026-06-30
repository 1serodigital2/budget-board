import { AlertProps, HandleInputChangeProps } from "./FormTypes";

export interface ExpenseFilterProps extends HandleInputChangeProps {
  catData: object;
  handleFilterSubmit: (e: React.SyntheticEvent) => void;
  handleFilterReset: () => void;
  filter: FilterProps;
  isPending: boolean;
}

export interface FilterProps {
  category?: number;
  dateRange?: DateRange;
}

export interface ExpenseFormData {
  amount: number;
  category: number | string;
  date: string;
  note?: string;
}

export interface ExpenseFormProps extends HandleInputChangeProps {
  handleFormSubmit: (e: React.SyntheticEvent) => void;
  inputValues: ExpenseFormData;
  isPending: boolean;
  submitMessage: AlertProps;
}

export interface ExpenseProps {
  amount: number;
  category: number;
  date: string | Date;
  note?: string;
  createdAt?: string;
}

export interface GetExpenseDetailsType {
  id: number;
  amount: number;
  category: number | string;
  date: Date | string;
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
  lastVisible: number | null;
  hasMore: boolean;
}

export interface ExpensesDetailTyps extends ExpenseProps {
  id: number;
}

export interface MothlyExpenseData {
  month: string;
  expense: number;
  budget: number;
}
export interface MothlyExpenseDataType {
  data: MothlyExpenseData[];
}

export interface MonthlyExpenseSummaryResponseType {
  month: string;
  expense: number;
  budget: number;
}
