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
  categoryId: string;
  userId: string;
}

export interface HandleInputChangeType {
  name: string;
  inputValue: string | number;
}
export interface CategoryFormProps {
  isPending: boolean;
  submitMessage: AlertProps;
  handleSubmit: (e: React.SubmitEvent) => void;
  handleInputChange: ({ name, inputValue }: HandleInputChangeType) => void;
  inputValues: CategoryFormType;
}

export interface UpdateCategoryType {
  userId: string;
  catId: string;
  categoryDetail: CategoryFormType;
}
