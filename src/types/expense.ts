import { CategoryProps } from "./category";
import { HandleInputChangeProps } from "./FormTypes";

export interface ExpenseFilterProps extends HandleInputChangeProps {
  catData: object;
  handleFilterSubmit: (e: React.SubmitEvent) => void;
  filter: FilterProps;
  isPending: boolean;
}

export interface FilterProps {
  category?: string;
  keyword?: string;
}
