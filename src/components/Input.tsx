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
  ...rest
}: InputProps) => {
  return (
    <div className="flex flex-col flex-1">
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
        max={
          type === "date" ? new Date().toISOString().split("T")[0] : undefined
        }
        className={`block mb-2.5 text-sm font-medium text-heading p-3 border rounded-xl ${
          sx ? sx : "text-white"
        }`}
        onChange={(e) =>
          handleInputChange({ name, inputValue: e.target.value })
        }
        value={inputValues}
        placeholder={placeholder}
        {...rest}
      />
    </div>
  );
};

export default Input;
