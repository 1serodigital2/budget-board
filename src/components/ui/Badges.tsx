import type { ReactNode } from "react";
import type { BudgetStatus } from "../../types/budget";

export const CategoryDot = ({
  color,
  className = "size-2.5",
}: {
  color: string;
  className?: string;
}) => (
  <span
    aria-hidden="true"
    className={`inline-block shrink-0 rounded-full ${className}`}
    style={{ backgroundColor: color }}
  />
);

/** Rounded square showing the category's colour with its initial. */
export const CategoryAvatar = ({
  name,
  color,
  size = "md",
}: {
  name: string;
  color: string;
  size?: "sm" | "md" | "lg";
}) => {
  const sizes = { sm: "size-8 text-xs", md: "size-9 text-sm", lg: "size-12 text-lg" };
  return (
    <span
      aria-hidden="true"
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-xl font-semibold ${sizes[size]}`}
      style={{ color }}
    >
      <span className="absolute inset-0 opacity-15" style={{ backgroundColor: color }} />
      <span className="relative">{name.trim().charAt(0).toUpperCase() || "?"}</span>
    </span>
  );
};

const statusStyles: Record<BudgetStatus, { label: string; className: string }> = {
  "on-track": { label: "On track", className: "bg-success-soft text-success" },
  "near-limit": { label: "Near limit", className: "bg-warning-soft text-warning" },
  over: { label: "Over budget", className: "bg-destructive-soft text-destructive" },
};

export const StatusBadge = ({ status }: { status: BudgetStatus }) => (
  <span
    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap ${statusStyles[status].className}`}
  >
    {statusStyles[status].label}
  </span>
);

export const Badge = ({ children }: { children: ReactNode }) => (
  <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
    {children}
  </span>
);

const barColors: Record<BudgetStatus, string> = {
  "on-track": "bg-success",
  "near-limit": "bg-warning",
  over: "bg-destructive",
};

export const ProgressBar = ({
  percentage,
  status,
  className = "h-1.5",
}: {
  percentage: number;
  status: BudgetStatus;
  className?: string;
}) => (
  <div
    role="progressbar"
    aria-valuemin={0}
    aria-valuemax={100}
    aria-valuenow={Math.round(Math.min(percentage, 100))}
    className={`w-full overflow-hidden rounded-full bg-muted ${className}`}
  >
    <div
      className={`h-full rounded-full transition-[width] duration-500 ${barColors[status]}`}
      style={{ width: `${Math.min(Math.max(percentage, 0), 100)}%` }}
    />
  </div>
);
