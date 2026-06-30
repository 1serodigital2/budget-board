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
          className="block mb-2 text-md text-gray-700 font-medium text-[.8rem]"
        >
          {label}
        </label>
      )}

      <select
        name={name}
        id=""
        className={`block text-[.8rem] font-medium text-heading py-2 px-3 border rounded-lg ${sx ? sx : ""}`}
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
