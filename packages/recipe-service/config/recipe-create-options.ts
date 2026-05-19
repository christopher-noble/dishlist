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
    { value: 'ML', singularLabel: 'ML', pluralLabel: 'ML' },
    { value: 'L', singularLabel: 'L', pluralLabel: 'L' },
    { value: 'G', singularLabel: 'G', pluralLabel: 'G' },
    { value: 'KG', singularLabel: 'KG', pluralLabel: 'KG' },
    { value: 'CUP', singularLabel: 'CUP', pluralLabel: 'CUPS' },
    { value: 'LB', singularLabel: 'LB', pluralLabel: 'LB' },
    { value: 'TBSP', singularLabel: 'TBSP', pluralLabel: 'TBSP' },
    { value: 'TSP', singularLabel: 'TSP', pluralLabel: 'TSP' },
  ],
} as const;

export type RecipeCreateOptionsConfig = typeof RECIPE_CREATE_OPTIONS;
