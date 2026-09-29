import { SelectType } from "../../types/FormTypes";

const Select = <T,>({
  name,
  label,
  getOptionValue,
  getOptionLabel,
  data,
  sx = "",
  required = false,
  handleInputChange,
  inputValues = "",
}: SelectType<T>) => {
  return (
    <div className="flex flex-col flex-1">
      {label && (
        <label
          htmlFor={name}
          className="block mb-2 text-sm text-foreground/90 font-medium tracking-wide"
        >
          {label} {required && <span className="text-destructive">*</span>}
        </label>
      )}

      <select
        name={name}
        id={name}
        className={`block w-full text-sm font-medium bg-[#1e1a2f] text-foreground border border-white/10 rounded-xl px-4 py-2.5 transition-all duration-300 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 ${sx ? sx : ""}`}
        required={required}
        value={inputValues}
        onChange={(e) =>
          handleInputChange({ name, inputValue: e.target.value })
        }
      >
        <option value="" className="bg-[#151221] text-muted-foreground">Please select category</option>
        {data &&
          data?.map((item) => {
            return (
              <option key={getOptionValue(item)} value={getOptionValue(item)} className="bg-[#151221] text-foreground">
                {getOptionLabel(item) || "null"}
              </option>
            );
          })}
      </select>
    </div>
  );
};

export default Select;
