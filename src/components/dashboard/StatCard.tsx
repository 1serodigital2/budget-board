import type { ReactNode } from "react";
import Card from "../ui/Card";
import Icon from "../ui/Icon";
import { Skeleton } from "../ui/States";

type Tone = "neutral" | "positive" | "negative" | "warning";

const toneText: Record<Tone, string> = {
  neutral: "text-muted-foreground",
  positive: "text-success",
  negative: "text-destructive",
  warning: "text-warning",
};

interface StatCardProps {
  label: string;
  value: ReactNode;
  icon: string;
  footer?: ReactNode;
  footerTone?: Tone;
  valueTone?: Tone;
  loading?: boolean;
}

const StatCard = ({
  label,
  value,
  icon,
  footer,
  footerTone = "neutral",
  valueTone,
  loading,
}: StatCardProps) => (
  <Card className="p-4 sm:p-5">
    <div className="flex items-center justify-between">
      <p className="truncate text-xs font-medium text-muted-foreground sm:text-[13px]">{label}</p>
      <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted sm:size-8 text-muted-foreground">
        <Icon name={icon} size={18} />
      </span>
    </div>
    {loading ? (
      <>
        <Skeleton className="mt-3 h-7 w-3/4 sm:h-8" />
        <Skeleton className="mt-3 h-3.5 w-full max-w-40" />
      </>
    ) : (
      <>
        <p
          className={`tabular mt-2 truncate text-xl leading-tight sm:text-[26px] font-semibold tracking-tight ${
            valueTone ? toneText[valueTone] : "text-foreground"
          }`}
        >
          {value}
        </p>
        {footer && <p className={`mt-2 text-xs font-medium ${toneText[footerTone]}`}>{footer}</p>}
      </>
    )}
  </Card>
);

export default StatCard;
