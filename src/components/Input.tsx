import { InputProps } from "../types/FormTypes";

const Input = ({
  name,
  label = "",
  handleInputChange,
  required = false,
  type = "text",
  inputValues,
  sx = "",
  placeholder = "",
}: InputProps) => {
  return (
    <div className="flex flex-col">
      <label
        htmlFor={name}
        className="block mb-2.5 text-md text-white font-medium text-heading"
      >
        {label}
      </label>
      <input
        type={type}
        id={name}
        required={required}
        className={`block mb-2.5 text-sm font-medium text-heading p-3 border rounded-xl ${sx ? sx : "text-white"}`}
        onChange={(e) =>
          handleInputChange({ name, inputValue: e.target.value })
        }
        value={inputValues}
        placeholder={placeholder}
      />
    </div>
  );
};

export default Input;
