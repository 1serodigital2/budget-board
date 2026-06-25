import { AlertProps } from "./FormTypes";

export interface CategoryFormType {
  category: string;
  color: string;
}

export interface AddCategoryType {
  userId: string;
  categoryDetail: CategoryFormType;
}

export interface GetCategoryType {
  categoryId: number;
  userId: string;
}

export interface HandleInputChangeType {
  name: string;
  inputValue: any;
}
export interface CategoryFormProps {
  isPending: boolean;
  submitMessage: AlertProps;
  handleSubmit: (e: React.SyntheticEvent) => void;
  handleInputChange: ({ name, inputValue }: HandleInputChangeType) => void;
  inputValues: CategoryFormType;
}

export interface UpdateCategoryType {
  userId: string;
  catId: number;
  categoryDetail: CategoryFormType;
}

export interface CategoryType {
  id: number;
  name: string;
}

export interface CategoryProps {
  id: number;
  name: string;
  color: string;
  createdAt: string;
  isSystem: boolean;
  slug?: string;
}
