import { TableBodyType } from "../../types/ui";

const TableBodyData = ({ item, children, colSpan }: TableBodyType) => {
  return (
    <td className="px-6 py-4" colSpan={colSpan}>
      {children ?? item}
    </td>
  );
};

export default TableBodyData;
