import { HandleInputChangeType } from "./category";

interface BaseFieldProps {
  name: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
}

export interface HandleInputChangeProps {
  handleInputChange: ({ name, inputValue }: HandleInputChangeType) => void;
}

export interface InputProps extends BaseFieldProps, HandleInputChangeProps {
  type?: string;
  inputValues?: string | number | undefined;
  sx?: string;
}

export interface LoginProps {
  email: string;
  password: string;
}

export interface AlertProps {
  type?: "success" | "error" | "warning" | "info" | "loading";
  message: string;
}

export interface LoginTypes {
  email: string;
  password: string;
}

export interface SelectType<T> extends BaseFieldProps, HandleInputChangeProps {
  data: T[];
  sx?: string;
  inputValues?: string | number | undefined;

  getOptionValue: (item: T) => string;
  getOptionLabel: (item: T) => string;
}
