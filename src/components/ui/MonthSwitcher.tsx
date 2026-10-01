import { currentMonthKey, formatMonth, isMonthKey, shiftMonth } from "../../utils/helpers";
import Icon from "./Icon";

interface MonthSwitcherProps {
  value: string;
  onChange: (month: string) => void;
  /** Latest selectable "YYYY-MM" (inclusive). */
  max?: string;
  className?: string;
}

const MonthSwitcher = ({ value, onChange, max, className = "" }: MonthSwitcherProps) => {
  const atMax = !!max && value >= max;
  const current = currentMonthKey();

  return (
    <div className={`flex min-w-0 items-center gap-2 ${className}`}>
      {value !== current && (!max || current <= max) && (
        <button
          type="button"
          onClick={() => onChange(current)}
          aria-label="Go to this month"
          title="This month"
          className="flex h-10 shrink-0 items-center gap-1.5 rounded-lg px-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground sm:px-3"
        >
          <Icon name="today" size={20} className="sm:hidden" />
          <span className="hidden sm:inline">This month</span>
        </button>
      )}
      <div className="flex h-10 min-w-0 flex-1 items-center rounded-lg border bg-card shadow-card">
        <button
          type="button"
          onClick={() => onChange(shiftMonth(value, -1))}
          className="flex h-full shrink-0 items-center rounded-l-lg px-2 text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Previous month"
        >
          <Icon name="chevron_left" />
        </button>
        <label className="relative flex h-full min-w-0 flex-1 cursor-pointer items-center justify-center gap-1.5 border-x px-3 text-sm font-semibold hover:bg-muted sm:min-w-40">
          <Icon name="calendar_month" size={18} className="text-muted-foreground" />
          <span className="truncate">{formatMonth(value)}</span>
          <input
            type="month"
            aria-label="Choose month"
            value={value}
            max={max}
            onClick={(e) => {
              try {
                e.currentTarget.showPicker?.();
              } catch {
                // Not supported everywhere; the arrows still work.
              }
            }}
            onChange={(e) => {
              const next = e.target.value;
              if (isMonthKey(next) && (!max || next <= max)) onChange(next);
            }}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
        </label>
        <button
          type="button"
          onClick={() => onChange(shiftMonth(value, 1))}
          disabled={atMax}
          className="flex h-full shrink-0 items-center rounded-r-lg px-2 text-muted-foreground hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-35"
          aria-label="Next month"
        >
          <Icon name="chevron_right" />
        </button>
      </div>
    </div>
  );
};

export default MonthSwitcher;
