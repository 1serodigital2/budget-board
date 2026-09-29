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
        className="block mb-2 text-sm text-foreground/90 font-medium tracking-wide"
      >
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <input
        type={type}
        id={name}
        required={required}
        max={
          type === "date" ? new Date().toISOString().split("T")[0] : undefined
        }
        className={`block w-full text-sm font-medium bg-black/20 text-foreground border border-white/10 rounded-xl px-4 py-2.5 transition-all duration-300 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground ${
          sx ? sx : ""
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
