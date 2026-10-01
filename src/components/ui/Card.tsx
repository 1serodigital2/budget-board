import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

const Card = ({ children, className = "" }: CardProps) => (
  <section className={`rounded-2xl border bg-card shadow-card ${className}`}>
    {children}
  </section>
);

interface CardHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export const CardHeader = ({
  title,
  description,
  action,
  className = "",
}: CardHeaderProps) => (
  <div
    className={`flex flex-wrap items-start justify-between gap-3 px-5 pt-5 sm:px-6 ${className}`}
  >
    <div className="min-w-0">
      <h2 className="text-[15px] font-semibold text-foreground">{title}</h2>
      {description && (
        <p className="mt-0.5 text-[13px] text-muted-foreground">{description}</p>
      )}
    </div>
    {action}
  </div>
);

export default Card;
