import type { RecipeIngredientInput } from '@/src/shared/api/generated/graphql';
import type { IngredientDraft } from '../components/ingredient-form-row';

export function parseIngredientAmount(text: string): number | null {
  const parsed = parseFloat(text.trim().replace(',', '.'));
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}

export function toRecipeIngredientInput(
  draft: IngredientDraft,
): RecipeIngredientInput | null {
  const item = draft.item.trim();
  if (!item) {
    return null;
  }

  const amountText = draft.amount.trim();
  if (amountText) {
    const amount = parseIngredientAmount(draft.amount);
    if (amount == null) {
      return null;
    }

    return { item, amount, unit: draft.unit };
  }

  return { item, amount: 0, unit: draft.unit };
}

export function draftsToRecipeIngredients(
  drafts: IngredientDraft[],
): RecipeIngredientInput[] {
  return drafts
    .map(toRecipeIngredientInput)
    .filter((ingredient): ingredient is RecipeIngredientInput => ingredient != null);
}

export function recipeIngredientsToDrafts(
  ingredients: Array<{ item: string; amount: number; unit: string }>,
): IngredientDraft[] {
  if (!ingredients.length) {
    return [{ item: '', amount: '', unit: '' }];
  }

  return ingredients.map((ingredient) => ({
    item: ingredient.item,
    amount: ingredient.amount > 0 ? String(ingredient.amount) : '',
    unit: ingredient.unit || '',
  }));
}
