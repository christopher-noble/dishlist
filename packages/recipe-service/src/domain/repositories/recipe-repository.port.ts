import type { Recipe, RecipeCategory, NutritionalInfo } from '../entities/recipe.ts';
import type { RecipeIngredient } from '../entities/recipe-ingredient.ts';

export interface CreateRecipeInput {
  userId: string;
  name: string;
  description: string;
  imageKey: string | null;
  category: RecipeCategory;
  ingredients: RecipeIngredient[];
  steps: string[];
  servesCount: number | null;
  nutritionalInfo: NutritionalInfo | null;
}

export interface UpdateRecipeInput {
  name?: string;
  description?: string;
  imageKey?: string | null;
  category?: RecipeCategory;
  ingredients?: RecipeIngredient[];
  steps?: string[];
  servesCount?: number | null;
  nutritionalInfo?: NutritionalInfo | null;
}

export interface RecipeStats {
  activeRecipeCount: number;
  archivedLast30DaysCount: number;
}

export interface RecipeRepositoryPort {
  create(input: CreateRecipeInput): Promise<Recipe>;
  findById(id: string): Promise<Recipe | null>;
  findActiveByUserId(userId: string): Promise<Recipe[]>;
  findArchivedByUserId(userId: string): Promise<Recipe[]>;
  countStatsByUserId(userId: string): Promise<RecipeStats>;
  update(id: string, input: UpdateRecipeInput): Promise<Recipe>;
  archive(id: string): Promise<Recipe>;
  recover(id: string): Promise<Recipe>;
  softDelete(id: string): Promise<void>;
  softDeleteAllArchivedByUserId(userId: string): Promise<number>;
  purgeExpiredArchivedRecipes(): Promise<number>;
}
