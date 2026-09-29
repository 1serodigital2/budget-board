import { TableBodyType } from "../../types/ui";

const TableBodyData = ({ item, children, colSpan }: TableBodyType) => {
  return (
    <td className="px-6 py-4 text-sm font-medium" colSpan={colSpan}>
      {children ?? item}
    </td>
  );
};

export default TableBodyData;
