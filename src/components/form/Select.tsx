import { InputProps } from "../../types/FormTypes";

const Select = ({
  name,
  label,
  handleInputChange,
  data,
  sx = "",
}: InputProps) => {
  return (
    <div className="flex flex-col">
      <label
        htmlFor={name}
        className="block mb-2.5 text-md text-white font-medium text-heading"
      >
        {label}
      </label>
      <select
        name={name}
        id=""
        className={`block mb-2.5 text-sm font-medium text-heading p-3 border rounded-xl ${sx ? sx : ""}`}
      >
        <option value="">Please select category</option>
        {data &&
          data?.map((category) => {
            return (
              <option value={category.id}>{category.name || "null"}</option>
            );
          })}
      </select>
    </div>
  );
};

export default Select;
