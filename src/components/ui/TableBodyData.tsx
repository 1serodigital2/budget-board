import { TableBodyType } from "../../types/ui";

const TableBodyData = ({ item, children }: TableBodyType) => {
  return (
    <>
      {!children && <td className="px-6 py-4">{item}</td>}
      {children && <td className="px-6 py-4">{children}</td>}
    </>
  );
};

export default TableBodyData;
