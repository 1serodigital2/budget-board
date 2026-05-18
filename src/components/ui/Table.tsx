const Table = ({ columnNames, data, children }) => {
  console.log("data", data);
  return (
    <div className="relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base border border-default rounded">
      <table className="w-full text-sm text-left rtl:text-right text-body">
        <thead className="text-sm text-body bg-neutral-secondary-soft border-b rounded-base border-default rounded">
          <tr>
            {columnNames.map((column) => (
              <th className="px-6 py-3 font-medium">{column}</th>
            ))}
          </tr>
        </thead>

        <tbody>
        {children}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
