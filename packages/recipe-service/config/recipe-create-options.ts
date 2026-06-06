export const RECIPE_CREATE_OPTIONS = {
  maxServes: 100,
  categories: [
    'BREAKFAST',
    'LUNCH',
    'DINNER',
    'SNACK',
    'DESSERT',
    'BEVERAGE',
  ] as const,
  ingredientUnits: [
    { value: 'ML', singularLabel: 'ml', pluralLabel: 'ml' },
    { value: 'L', singularLabel: 'L', pluralLabel: 'L' },
    { value: 'G', singularLabel: 'g', pluralLabel: 'g' },
    { value: 'KG', singularLabel: 'kg', pluralLabel: 'kg' },
    { value: 'CUP', singularLabel: 'cup', pluralLabel: 'cups' },
    { value: 'LB', singularLabel: 'lb', pluralLabel: 'lb' },
    { value: 'TBSP', singularLabel: 'tbsp', pluralLabel: 'tbsp' },
    { value: 'TSP', singularLabel: 'tsp', pluralLabel: 'tsp' },
  ],
} as const;

export type RecipeCreateOptionsConfig = typeof RECIPE_CREATE_OPTIONS;
