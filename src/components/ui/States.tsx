import type { ReactNode } from "react";
import Icon from "./Icon";

type AlertTone = "info" | "success" | "warning" | "error";

const alertTones: Record<AlertTone, { icon: string; className: string }> = {
  info: { icon: "info", className: "bg-info-soft text-info border-info/20" },
  success: {
    icon: "check_circle",
    className: "bg-success-soft text-success border-success/20",
  },
  warning: {
    icon: "warning",
    className: "bg-warning-soft text-warning border-warning/25",
  },
  error: {
    icon: "error",
    className: "bg-destructive-soft text-destructive border-destructive/20",
  },
};

interface AlertProps {
  tone?: AlertTone;
  title?: ReactNode;
  children?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export const Alert = ({
  tone = "info",
  title,
  children,
  action,
  className = "",
}: AlertProps) => (
  <div
    role={tone === "error" ? "alert" : "status"}
    className={`flex flex-col gap-3 rounded-xl border px-4 py-3 sm:flex-row sm:items-center ${alertTones[tone].className} ${className}`}
  >
    <div className="flex flex-1 items-start gap-3">
      <Icon name={alertTones[tone].icon} filled className="mt-px" />
      <div className="min-w-0 text-sm">
        {title && <p className="font-semibold">{title}</p>}
        {children && (
          <div className={title ? "mt-0.5 text-foreground/80" : "font-medium"}>
            {children}
          </div>
        )}
      </div>
    </div>
    {action && <div className="shrink-0 sm:ml-auto">{action}</div>}
  </div>
);

interface EmptyStateProps {
  icon: string;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export const EmptyState = ({
  icon,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) => (
  <div
    className={`flex flex-col items-center justify-center px-6 py-12 text-center ${className}`}
  >
    <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
      <Icon name={icon} size={24} />
    </div>
    <h3 className="text-[15px] font-semibold text-foreground">{title}</h3>
    {description && (
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
    )}
    {action && <div className="mt-5">{action}</div>}
  </div>
);

export const ErrorState = ({
  error,
  onRetry,
}: {
  error: unknown;
  onRetry?: () => void;
}) => (
  <EmptyState
    icon="cloud_off"
    title="Something went wrong"
    description={error instanceof Error ? error.message : "Please try again."}
    action={
      onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="text-sm font-semibold text-primary hover:underline"
        >
          Try again
        </button>
      )
    }
  />
);

export const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded-md bg-muted ${className}`} />
);
