export enum DiscoverCategoryId {
  ALL = 'ALL',
  BREAKFAST = 'BREAKFAST',
  LUNCH = 'LUNCH',
  DINNER = 'DINNER',
  SNACK = 'SNACK',
  DESSERT = 'DESSERT',
  BEVERAGE = 'BEVERAGE',
}

export interface DiscoverCategory {
  id: DiscoverCategoryId;
  label: string;
  emoji: string;
}
