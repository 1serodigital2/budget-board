const categories = [
  {
    category: "Food",
    budget: 5000,
    spent: 6200,
  },
  {
    category: "Shopping",
    budget: 4000,
    spent: 2500,
  },
  {
    category: "Transport",
    budget: 3000,
    spent: 2100,
  },
  {
    category: "Bills",
    budget: 2000,
    spent: 1900,
  },
];

export default function CategoryBudgetProgress() {
  return (
    <div className="grid grid-cols-4 gap-5">
      {categories.map((item) => {
        const percentage = (item.spent / item.budget) * 100;

        const barColor =
          percentage > 100
            ? "bg-red-500"
            : percentage >= 80
              ? "bg-yellow-500"
              : "bg-green-500";

        return (
          <div key={item.category} className="rounded-lg border p-4 shadow-sm">
            <div className="flex justify-between mb-2">
              <h4 className="font-medium">{item.category}</h4>
              <span className="font-medium">{percentage.toFixed(0)}%</span>
            </div>

            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${barColor}`}
                style={{
                  width: `${Math.min(percentage, 100)}%`,
                }}
              />
            </div>

            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>Budget: ₹{item.budget.toLocaleString()}</span>
              <span>Spent: ₹{item.spent.toLocaleString()}</span>
            </div>

            <div className="mt-1 text-sm">
              {percentage > 100 ? (
                <span className="text-red-600">
                  Over by ₹{(item.spent - item.budget).toLocaleString()}
                </span>
              ) : (
                <span className="text-green-600">
                  Remaining ₹{(item.budget - item.spent).toLocaleString()}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
