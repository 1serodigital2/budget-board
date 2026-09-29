import { NavLink, useNavigate } from "react-router-dom";
import Alert from "../ui/Alert";
import { moneyFormat } from "../../utils/helpers";
import { BudgetTableProps } from "../../types/budget";

const CategoryWiseBudget = ({
  budgetData,
  monthFilter,
  totalRemaining,
  totalBudgetAmount,
  totalSpent,
  showTotal = true,
  hideMonth = false,
}: BudgetTableProps) => {
  const navigate = useNavigate();
  
  if (!budgetData) {
    return <Alert message="Data not found" />;
  }

  // Pre-defined design colors and icons for categories
  const designTokens = [
    { bg: "bg-[#451a24]", text: "text-[#ef4444]", icon: "electric_bolt" },
    { bg: "bg-[#422c15]", text: "text-[#f59e0b]", icon: "trending_up" },
    { bg: "bg-[#252836]", text: "text-[#9ca3af]", icon: "family_restroom" },
    { bg: "bg-[#133c2b]", text: "text-[#10b981]", icon: "fitness_center" },
    { bg: "bg-[#423315]", text: "text-[#f59e0b]", icon: "directions_car" },
    { bg: "bg-[#133c2b]", text: "text-[#10b981]", icon: "restaurant" },
    { bg: "bg-[#252836]", text: "text-[#9ca3af]", icon: "category" },
    { bg: "bg-[#252836]", text: "text-[#9ca3af]", icon: "shield" },
    { bg: "bg-[#422c15]", text: "text-[#f59e0b]", icon: "movie" },
    { bg: "bg-[#422c15]", text: "text-[#f59e0b]", icon: "spa" },
  ];

  return (
    <div className="w-full">
      {/* Header */}
      <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-[18px] font-bold text-foreground tracking-tight">Category Breakdown</h2>
            <span className="bg-muted px-2 py-0.5 rounded-full text-[10px] text-muted-foreground font-semibold uppercase tracking-widest border border-border">
              {budgetData?.length} tracked
            </span>
          </div>
          <p className="text-muted-foreground text-[12px] mt-1">Real-time expenditure limits and actual progress tracks</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[16px] text-muted-foreground">search</span>
            <input 
              type="text" 
              placeholder="Filter categories..." 
              className="bg-background border border-border rounded-lg pl-9 pr-4 py-1.5 text-[13px] text-foreground focus:outline-none focus:border-primary/50 w-[200px]"
            />
          </div>
          <button className="flex items-center gap-2 bg-background hover:bg-muted border border-border px-3 py-1.5 rounded-lg transition-colors cursor-pointer text-[13px] text-foreground font-semibold">
            <span className="material-symbols-outlined text-[16px]">tune</span>
            Manage
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[13px]">
          <thead className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-b border-border/40">
            <tr>
              <th className="px-6 py-4 font-semibold">CATEGORY</th>
              <th className="px-6 py-4 font-semibold">BUDGET</th>
              <th className="px-6 py-4 font-semibold">SPENT</th>
              <th className="px-6 py-4 font-semibold">REMAINING</th>
              <th className="px-6 py-4 font-semibold w-[200px]">UTILIZATION</th>
              <th className="px-6 py-4 font-semibold">STATUS</th>
              <th className="px-6 py-4 font-semibold text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {budgetData.map((budget, i) => {
              const tokens = designTokens[i % designTokens.length];
              const isOver = budget.percentage > 100;
              const isMaxed = budget.percentage === 100;
              const isNear = budget.percentage >= 80 && budget.percentage < 100;
              
              const statusColor = isOver 
                ? "bg-destructive/20 text-destructive border-destructive/20" 
                : isMaxed 
                ? "bg-muted text-muted-foreground border-border" 
                : isNear 
                ? "bg-warning/20 text-warning border-warning/20" 
                : "bg-success/20 text-success border-success/20";
                
              const statusText = isOver ? "OVER BUDGET" : isMaxed ? "MAXED" : isNear ? "NEAR LIMIT" : "ON TRACK";
              
              const barColor = isOver ? "bg-[#ef4444]" : isMaxed ? "bg-[#f59e0b]" : isNear ? "bg-[#f59e0b]" : "bg-[#10b981]";
              
              return (
                <tr key={budget.categoryName} className="hover:bg-white/[0.02] transition-colors group cursor-pointer" onClick={() => {
                  if(budget.spent > 0) navigate(`/expenses?month=${monthFilter}&category=${budget.categorySlug}`)
                }}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${tokens.bg} ${tokens.text}`}>
                        <span className="material-symbols-outlined text-[18px]">{tokens.icon}</span>
                      </div>
                      <div>
                        <div className="font-bold text-foreground text-[14px]">{budget.categoryName}</div>
                        <div className="text-[11px] text-muted-foreground">{budget.categoryName} expenses</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-foreground">{moneyFormat(budget.budget)}</td>
                  <td className="px-6 py-4 font-bold text-foreground">{moneyFormat(budget.spent)}</td>
                  <td className="px-6 py-4 font-bold">
                    <span className={budget.remaining < 0 ? "text-destructive" : budget.remaining > 0 ? "text-success" : "text-foreground"}>
                      {budget.remaining < 0 ? "-" : budget.remaining > 0 ? "+" : ""}{moneyFormat(Math.abs(budget.remaining))}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5">
                      <div className="text-[10px] font-bold text-foreground">{budget.percentage.toFixed(2)}%</div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${Math.min(budget.percentage, 100)}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border ${statusColor}`}>
                      {statusText}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="material-symbols-outlined text-muted-foreground group-hover:text-foreground text-[18px]">chevron_right</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      
      {/* Footer Info */}
      <div className="p-4 flex items-center justify-between border-t border-border/40 bg-background/50 text-[11px] text-muted-foreground font-medium">
        <div>Showing all {budgetData.length} active budget lines • <span className="text-success">{budgetData.filter(b => b.percentage < 80).length} on track</span> • <span className="text-destructive">{budgetData.filter(b => b.percentage > 100).length} deficit</span></div>
        <div className="flex items-center gap-1.5">
          Auto-sync with Bank Feeds: <span className="w-1.5 h-1.5 rounded-full bg-success"></span> <span className="text-success">Synced 4m ago</span>
        </div>
      </div>
    </div>
  );
};

export default CategoryWiseBudget;
