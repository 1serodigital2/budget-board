import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import Icon from "./Icon";

interface PageHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  back?: { to: string; label: string };
}

const PageHeader = ({ title, description, actions, back }: PageHeaderProps) => (
  <header className="mb-6 sm:mb-8">
    {back && (
      <Link
        to={back.to}
        className="mb-3 inline-flex items-center gap-1 text-[13px] font-medium text-muted-foreground hover:text-foreground"
      >
        <Icon name="arrow_back" size={16} />
        {back.label}
      </Link>
    )}
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-[28px]">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">{actions}</div>}
    </div>
  </header>
);

export default PageHeader;
