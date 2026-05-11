export interface InputProps {
  name: string;
  label: string;
  handleInputChange: () => void;
  required?: boolean;
}

export interface LoginProps {
  email: string;
  password: string;
}
