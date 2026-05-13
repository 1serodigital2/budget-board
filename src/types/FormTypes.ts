export interface InputProps {
  name: string;
  label: string;
  handleInputChange: (name: string, value: string | number) => void;
  required?: boolean;
  type?: string;
  inputValues?: string | number | undefined
}

export interface LoginProps {
  email: string;
  password: string;
}

export interface ExpenseProps {
  amount: number;
  category: string;
  note?: string;
}
