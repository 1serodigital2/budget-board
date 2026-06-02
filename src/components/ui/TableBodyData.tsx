import { TableBodyType } from "../../types/ui";

const TableBodyData = ({ item, children }: TableBodyType) => {
  return <td className="px-6 py-4">{children ?? item}</td>;
};

export default TableBodyData;
