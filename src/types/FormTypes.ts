export interface InputProps {
  name: string;
  label: string;
  handleInputChange: (name: string, value: string | number) => void;
  required?: boolean;
  type: any;
}

export interface LoginProps {
  email: string;
  password: string;
}
