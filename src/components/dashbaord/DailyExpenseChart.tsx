import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { MothlyExpenseDataType } from "../../types/expense";

export default function MonthlyExpenseTred({data}: MothlyExpenseDataType) {
  return (
    <div style={{ width: "100%", aspectRatio: 1.618 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />

          <YAxis />

          <Tooltip
            formatter={(value) => `₹${Number(value).toLocaleString()}`}
          />

          <Legend />

          {/* <Line
            type="monotone"
            dataKey="budget"
            name="Budget"
            stroke="#22c55e"
            strokeWidth={2}
            activeDot={{ r: 8 }}
          /> */}

          <Line
            type="monotone"
            dataKey="expense"
            name="Expense"
            stroke="#ef4444"
            strokeWidth={2}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}