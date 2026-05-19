import { RECIPE_CREATE_OPTIONS } from '../../../config/recipe-create-options.ts';
import { RecipeCategory } from '../entities/recipe.ts';

export interface IngredientUnitOption {
  value: string;
  singularLabel: string;
  pluralLabel: string;
}

export interface RecipeCreateOptions {
  maxServes: number;
  categories: RecipeCategory[];
  ingredientUnits: IngredientUnitOption[];
}

export function getAllowedIngredientUnits(): string[] {
  return RECIPE_CREATE_OPTIONS.ingredientUnits.map((unit) => unit.value);
}

export function getRecipeCreateOptions(): RecipeCreateOptions {
  return {
    maxServes: RECIPE_CREATE_OPTIONS.maxServes,
    categories: [...RECIPE_CREATE_OPTIONS.categories] as RecipeCategory[],
    ingredientUnits: RECIPE_CREATE_OPTIONS.ingredientUnits.map((unit) => ({
      value: unit.value,
      singularLabel: unit.singularLabel,
      pluralLabel: unit.pluralLabel,
    })),
  };
}
