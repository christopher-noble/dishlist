import type { Recipe } from '../../../../domain/entities/recipe.ts';
import { resolveImageUrl } from '../../../../infrastructure/media/asset-storage.ts';

export const recipeTypeResolver = {
  imageKey(parent: Recipe): string | null {
    return resolveImageUrl(parent.imageKey);
  },
};
