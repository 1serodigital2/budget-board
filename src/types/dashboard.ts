import { ReactNode } from "react";

export interface BudgetSummaryCardType {
  children: ReactNode;
  iconBg: string;
  total: string | number;
  title: string;
  footer: string;
  showColor?: boolean;
  isMobile?: boolean;
}
