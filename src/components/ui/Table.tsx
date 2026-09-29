import { TableProps } from "../../types/table";

const Table = ({ columnNames, data = [], children }: TableProps) => {
  return (
    <div className="glass-panel overflow-x-auto">
      <table className="w-full text-left text-sm text-foreground">
        <thead className="bg-white/5 border-b border-white/10 text-xs uppercase tracking-wider text-muted-foreground">
          <tr>
            {columnNames.map((column, index) => (
              <th key={index} className="px-6 py-4 font-semibold">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 [&>tr]:transition-colors [&>tr:hover]:bg-white/5">
          {children}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
