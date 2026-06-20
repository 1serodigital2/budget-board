import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const data = [
  { category: "Housing & Rent", amount: 19500 },
  { category: "Food & Dining", amount: 15000 },
  { category: "Clothing", amount: 8000 },
  { category: "Entertainment", amount: 7000 },
  { category: "Transport", amount: 5000 },
  { category: "Other", amount: 6177 },
];

const COLORS = [
  "#059669",
  "#34d399",
  "#0284c7",
  "#eab308",
  "#f97316",
  "#64748b",
];

export default function SpendingByCategory() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const totalSpent = data.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const hoveredCategory =
    activeIndex !== null ? data[activeIndex] : null;

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;

    const item = payload[0].payload;

    const percentage = (
      (item.amount / totalSpent) *
      100
    ).toFixed(1);

    return (
      <div className="bg-white border rounded-xl px-3 py-2 shadow-md">
        <div className="flex gap-5 items-center">
          <span>{item.category}</span>

          <span className="font-semibold">
            ₹{item.amount.toLocaleString("en-IN")}
          </span>
        </div>

        <div className="text-xs text-gray-500 mt-1">
          {percentage}% of total spending
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white border rounded-lg p-4">
      <h3 className="text-[.9rem] font-medium">
        Spending by Category
      </h3>

      <p className="text-gray-500 text-sm mb-4">
        June 2026
      </p>

      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="amount"
              nameKey="category"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={85}
              activeIndex={activeIndex ?? undefined}
              // activeOuterRadius={95}
              onMouseEnter={(_, index) =>
                setActiveIndex(index)
              }
              onMouseLeave={() =>
                setActiveIndex(null)
              }
            >
              {data.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index]}
                />
              ))}
            </Pie>

            <Tooltip content={<CustomTooltip />} />

            {/* Center Amount */}
            <text
              x="50%"
              y="48%"
              textAnchor="middle"
              dominantBaseline="middle"
              style={{
                fontSize: "14px",
                fontWeight: 700,
              }}
            >
              ₹
              {(
                hoveredCategory?.amount ??
                totalSpent
              ).toLocaleString("en-IN")}
            </text>

            {/* Center Label */}
            <text
              x="50%"
              y="58%"
              textAnchor="middle"
              dominantBaseline="middle"
              style={{
                fontSize: "12px",
                fill: "#64748b",
              }}
            >
              {hoveredCategory?.category ??
                "Total Spent"}
            </text>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-y-2 gap-x-4 mt-2">
        {data.map((item, index) => (
          <div
            key={item.category}
            className="flex items-center gap-2 text-sm"
          >
            <span
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor: COLORS[index],
              }}
            />

            <span>{item.category}</span>
          </div>
        ))}
      </div>
    </div>
  );
}