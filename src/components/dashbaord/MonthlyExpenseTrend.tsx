import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Line,
  ComposedChart
} from "recharts";
import useEpxenseTrend from "../../hooks/useExpenseTrend";
import { useState } from "react";
import { DateFilter } from "../../utils/helpers";

const MonthlyExpenseTrend = () => {
  const [filteredMonth, setFilteredMonth] = useState<DateFilter>("last-6-months");

  const { useMonthlyExpenseTrend } = useEpxenseTrend();
  const { data } = useMonthlyExpenseTrend(filteredMonth);

  const handleMonthFilter = (month: DateFilter) => {
    setFilteredMonth(month);
  };
  
  const CustomLegend = () => (
    <div className="flex items-center gap-6 mt-1 mb-4 px-2">
      <div className="flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-[#10b981]"></div>
        <span className="text-[11px] font-semibold text-foreground tracking-wide">Allocated Budget (?17,473)</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-[#fca5a5]"></div>
        <span className="text-[11px] font-semibold text-foreground tracking-wide">Actual Spend (?17,782)</span>
      </div>
    </div>
  );

  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-[18px] font-bold text-foreground tracking-tight">Budget vs Expense</h3>
          <p className="text-[12px] text-muted-foreground mt-1">Comparative variance across historical spending</p>
        </div>
        <div className="flex items-center gap-1.5 bg-background border border-border/50 p-1 rounded-lg">
          <button
            className={`rounded-md px-3 py-1.5 text-[11px] font-bold transition-colors cursor-pointer ${filteredMonth === "last-6-months" ? "bg-card border border-border text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            onClick={() => handleMonthFilter("last-6-months")}
          >
            6 Months
          </button>
          <button
            className={`rounded-md px-3 py-1.5 text-[11px] font-bold transition-colors cursor-pointer ${filteredMonth === "last-1-year" ? "bg-card border border-border text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            onClick={() => handleMonthFilter("last-1-year")}
          >
            1 Year
          </button>
        </div>
      </div>
      
      <CustomLegend />

      <div className="flex-1 min-h-[220px] mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: -20,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fca5a5" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#fca5a5" stopOpacity={0.01} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2a2c35" strokeOpacity={0.7} />

            <XAxis dataKey="month" tick={{ fontSize: "10px", fill: "#9ca3af", fontWeight: 600 }} tickLine={false} axisLine={false} dy={10} />

            <YAxis tick={{ fontSize: "10px", fill: "#9ca3af", fontWeight: 600 }} tickLine={false} axisLine={false} dx={-10} tickFormatter={(val) => val >= 1000 ? `${val/1000}k` : val} />

            <Tooltip
              formatter={(value) => `'${Number(value).toLocaleString("en-IN")}`}
              contentStyle={{
                backgroundColor: "#1c1d24",
                borderColor: "#2a2c35",
                borderRadius: "8px",
                color: "#f3f4f6",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.3)",
              }}
              itemStyle={{ color: "#f3f4f6", fontSize: "12px", fontWeight: 600 }}
              labelStyle={{ color: "#9ca3af", fontSize: "11px", marginBottom: "4px" }}
            />

            <Area
              type="monotone"
              dataKey="expense"
              name="Expense"
              stroke="#fca5a5"
              strokeWidth={3}
              fill="url(#expenseGradient)"
              activeDot={{ r: 6, fill: "#1c1d24", stroke: "#fca5a5", strokeWidth: 2 }}
            />
            
            <Line 
              type="step" 
              dataKey="budget" 
              name="Budget" 
              stroke="#10b981" 
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
              activeDot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex items-center justify-between mt-4 px-2 pt-2 border-t border-border/40">
        <p className="text-[11px] text-muted-foreground font-medium">Allocation remained flat at ?17,473/mo</p>
        <p className="text-[11px] font-semibold text-[#fca5a5] flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
          +?1,240 spend increase over Aug
        </p>
      </div>
    </div>
  );
};
export default MonthlyExpenseTrend;
