export interface InputProps {
  name: string;
  label: string;
  handleInputChange: (name: string, value: string | number) => void;
  required?: boolean;
  type?: string;
  inputValues?: string | number | undefined;
  sx?: object;
}

export interface LoginProps {
  email: string;
  password: string;
}

export interface ExpenseProps {
  amount: number;
  category: string;
  note?: string;
  createdAt?: string;
}
export interface AlertProps {
  type?: "success" | "error" | "warning" | "info" | "loading";
  message: string;
}

export interface ExpenseFormProps {
  handleFormSubmit: (e: React.SubmitEvent) => void;
  handleInputChange: (name: string, inputValue: string | number) => void;
  inputValues: ExpenseProps;
  isPending: boolean;
  submitMessage: AlertProps;
}

export interface LoginTypes {
  email: string;
  password: string;
}
