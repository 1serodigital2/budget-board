import { InputProps } from "../types/FormTypes";

const Input = ({ name, label, required = false }: InputProps) => {
  return (
    <>
      <label htmlFor="email">Email / Username</label>
      <input type="text" required />
    </>
  );
};

export default Input;
