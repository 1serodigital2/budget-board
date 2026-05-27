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
      <label
        htmlFor={name}
        className="block mb-2.5 text-md text-white font-medium text-heading"
      >
        {label}
      </label>
      <select
        name={name}
        id=""
        className={`block text-sm font-medium text-heading p-3 border rounded-xl ${sx ? sx : ""}`}
        required={required}
        value={inputValues}
        onChange={(e) =>
          handleInputChange({ name, inputValue: e.target.value })
        }
      >
        <option value="">Please select category</option>
        {data &&
          data?.map((item) => {
            return (
              <option key={getOptionValue(item)} value={getOptionValue(item)}>
                {getOptionLabel(item) || "null"}
              </option>
            );
          })}
      </select>
    </div>
  );
};

export default Select;
