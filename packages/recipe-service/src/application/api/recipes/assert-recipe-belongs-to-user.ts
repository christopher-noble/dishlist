import { GraphQLError } from 'graphql';

import type { Recipe } from '../../../domain/entities/recipe.ts';

export function assertRecipeBelongsToUser(recipe: Recipe | null, userId: string): Recipe {
  if (!recipe) {
    throw new GraphQLError('Recipe not found', {
      extensions: { code: 'NOT_FOUND' },
    });
  }

  if (recipe.userId !== userId) {
    throw new GraphQLError('Recipe not found', {
      extensions: { code: 'NOT_FOUND' },
    });
  }

  if (recipe.deletedAt) {
    throw new GraphQLError('Recipe not found', {
      extensions: { code: 'NOT_FOUND' },
    });
  }

  return recipe;
}
