export interface BudgetFormType {
  category: string;
  amount: number;
  month: string;
}

export interface BudgetType {
  budgetDetail: BudgetFormType;
  uid: string;
}
