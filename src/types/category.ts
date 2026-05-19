export interface CategoryFormType {
  category: string;
  color: string;
}

export interface AddCategoryType {
  userId: string;
  categoryDetail: CategoryFormType;
}

export interface GetCategoryType{
  categoryId: string,
  userId: string,
}