import type { RecipeIngredient } from '../entities/recipe-ingredient.ts';
import { getAllowedIngredientUnits } from './recipe-create-options.ts';

const LEGACY_UNIT_TO_CANONICAL: Record<string, string> = {
  ml: 'ML',
  l: 'L',
  g: 'G',
  kg: 'KG',
  cup: 'CUP',
  lb: 'LB',
  tbsp: 'TBSP',
  tsp: 'TSP',
};

export function normalizeIngredientUnit(unit: string): string {
  if (!unit.trim()) {
    return '';
  }

  return LEGACY_UNIT_TO_CANONICAL[unit.trim().toLowerCase()] ?? unit.trim().toUpperCase();
}

export function parseRecipeIngredientsFromDb(raw: unknown): RecipeIngredient[] {
  if (!Array.isArray(raw)) {
    return [];
  }

  const allowedUnits = getAllowedIngredientUnits();
  const ingredients: RecipeIngredient[] = [];

  for (const entry of raw) {
    if (typeof entry === 'string') {
      const item = entry.trim();
      if (item.length > 0) {
        ingredients.push({ item, amount: 0, unit: '' });
      }
      continue;
    }

    if (!entry || typeof entry !== 'object') {
      continue;
    }

    const record = entry as Record<string, unknown>;
    const item = typeof record.item === 'string' ? record.item.trim() : '';
    if (item.length === 0) {
      continue;
    }

    const amount = Number(record.amount);
    const unit =
      typeof record.unit === 'string' ? normalizeIngredientUnit(record.unit) : '';

    if (Number.isFinite(amount) && amount > 0) {
      if (unit === '' || allowedUnits.includes(unit)) {
        ingredients.push({ item, amount, unit });
        continue;
      }
    }

    ingredients.push({ item, amount: 0, unit: '' });
  }

  return ingredients;
}

export function assertValidRecipeIngredientsForWrite(
  ingredients: RecipeIngredient[],
): void {
  const allowedUnits = getAllowedIngredientUnits();

  if (ingredients.length === 0) {
    throw new Error('At least one ingredient is required');
  }

  for (const ingredient of ingredients) {
    if (!ingredient.item.trim()) {
      throw new Error('Each ingredient must have an item name');
    }

    if (!Number.isFinite(ingredient.amount) || ingredient.amount < 0) {
      throw new Error('Each ingredient must have a non-negative amount');
    }

    const unit = normalizeIngredientUnit(ingredient.unit);
    if (unit !== '' && !allowedUnits.includes(unit)) {
      throw new Error(`Invalid ingredient unit: ${ingredient.unit}`);
    }
  }
}

export function serializeRecipeIngredientsForDb(
  ingredients: RecipeIngredient[],
): RecipeIngredient[] {
  return ingredients.map((ingredient) => ({
    item: ingredient.item.trim(),
    amount: ingredient.amount,
    unit: normalizeIngredientUnit(ingredient.unit),
  }));
}
