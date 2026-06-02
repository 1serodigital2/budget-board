import { ReactNode } from "react";

export interface TableProps {
  columnNames: string[];
  data?: object[];
  children?: ReactNode;
}
