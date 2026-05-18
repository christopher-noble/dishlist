export enum MealCategory {
  BREAKFAST = 'BREAKFAST',
  LUNCH = 'LUNCH',
  DINNER = 'DINNER',
  SNACK = 'SNACK',
  DESSERT = 'DESSERT',
  BEVERAGE = 'BEVERAGE',
}

export interface NutritionalInfo {
  calories?: number | null;
  protein?: number | null;
  carbs?: number | null;
  fat?: number | null;
  fiber?: number | null;
}

export interface Meal {
  id: string;
  userId: string;
  name: string;
  description: string;
  imageUrl: string | null;
  category: MealCategory;
  ingredients: string[];
  nutritionalInfo: NutritionalInfo | null;
  createdAt: Date;
  updatedAt: Date;
  archivedAt: Date | null;
  deletedAt: Date | null;
}
