import { InputProps } from "../types/FormTypes";

const Input = ({
  name,
  label,
  handleInputChange,
  required = false,
}: InputProps) => {
  return (
    <div className="flex flex-col">
      <label
        htmlFor={name}
        className="block mb-2.5 text-md text-white font-medium text-heading "
      >
        {label}
      </label>
      <input
        type="text"
        id={name}
        required={required}
        className="block mb-2.5 text-sm font-medium text-heading p-3 border rounded-xl text-white"
        onChange={(e) => handleInputChange(name, e.target.value)}
      />
    </div>
  );
};

export default Input;
