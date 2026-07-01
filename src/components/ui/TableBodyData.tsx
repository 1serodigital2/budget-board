import { TableBodyType } from "../../types/ui";

const TableBodyData = ({ item, children, colSpan }: TableBodyType) => {
  return (
    <td className="px-1 py-3 md:px-6 md:py-4 text-[.7rem] md:text-[.8rem] text-gray-600" colSpan={colSpan}>
      {children ?? item}
    </td>
  );
};

export default TableBodyData;
