import {
  Area,
  AreaChart,
  Line,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { MothlyExpenseDataType } from "../../types/expense";

export default function MonthlyExpenseTrend({ data }: MothlyExpenseDataType) {
  return (
    <div className="bg-white border rounded-lg p-4">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-[.9rem] font-medium">Budget vs Expense</h3>
        <div className="flex justify-between items-center gap-3">
          <button className="bg-gray-200 rounded-lg py-0.5 px-2 text-[.7rem]  cursor-pointer">
            Last 6 month
          </button>
          <button className="rounded-lg py-0.5 px-2 text-[.7rem]  cursor-pointer">
            1 year
          </button>
        </div>
      </div>

      <div style={{ width: "100%", aspectRatio: 1.618  }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <defs>
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="month" tick={{ fontSize: "12px" }} />

            <YAxis tick={{ fontSize: "12px" }} />

            <Tooltip
              formatter={(value) => `₹${Number(value).toLocaleString("en-IN")}`}
              contentStyle={{
                fontSize: "12px",
              }}
            />

            <Legend
              wrapperStyle={{
                fontSize: "12px",
              }}
            />

            <Area
              type="monotone"
              dataKey="expense"
              name="Expense"
              stroke="#ef4444"
              fill="url(#expenseGradient)"
            />
            <Area
              type="monotone"
              dataKey="budget"
              name="Budget"
              stroke="#22c55e"
              fill="#22c55e"
              fillOpacity={0.15}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
