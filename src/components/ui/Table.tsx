import { TableProps } from "../../types/table";

const Table = ({ columnNames, data = [], children }: TableProps) => {
  return (
    <div className="relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base  rounded">
      <table className="w-full text-sm text-left rtl:text-right text-body">
        <thead className="md:text-sm text-body bg-neutral-secondary-soft border-b rounded-base border-default rounded">
          <tr className=" hover:bg-blue-50 transition duration-200">
            {columnNames.map((column) => (
              <th className="px-6 py-3 font-medium  text-[.7rem]  md:text-[.8rem] text-gray-800 ">
                {column}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>{children}</tbody>
      </table>
    </div>
  );
};

export default Table;
