export interface Category {
  id: number;
  name: string;
  color: string;
  slug: string;
  isSystem: boolean;
  createdAt: string;
}

export interface CategoryInput {
  name: string;
}
