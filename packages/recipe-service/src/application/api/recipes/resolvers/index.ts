import { createRecipeResolver } from './create-recipe.ts';
import { updateRecipeResolver } from './update-recipe.ts';
import { recipeResolver } from './recipe.ts';
import { recipesResolver } from './recipes.ts';
import { archiveRecipeResolver } from './archive-recipe.ts';
import { recoverRecipeResolver } from './recover-recipe.ts';
import { deleteRecipeResolver } from './delete-recipe.ts';
import { getRecipeUploadTargetResolver } from './get-recipe-upload-target.ts';
import { recipeStatsResolver } from './recipe-stats.ts';
import { recipeCreateOptionsResolver } from './recipe-create-options.ts';
import { recipeTypeResolver } from './recipe-type.ts';

export const resolvers = {
  Query: {
    recipes: recipesResolver.recipes,
    archivedRecipes: recipesResolver.archivedRecipes,
    recipe: recipeResolver.recipe,
    recipeStats: recipeStatsResolver.recipeStats,
    recipeCreateOptions: recipeCreateOptionsResolver.recipeCreateOptions,
  },
  Mutation: {
    createRecipe: createRecipeResolver.createRecipe,
    updateRecipe: updateRecipeResolver.updateRecipe,
    archiveRecipe: archiveRecipeResolver.archiveRecipe,
    recoverRecipe: recoverRecipeResolver.recoverRecipe,
    deleteRecipe: deleteRecipeResolver.deleteRecipe,
    deleteAllArchivedRecipes: deleteRecipeResolver.deleteAllArchivedRecipes,
    getRecipeUploadTarget:
      getRecipeUploadTargetResolver.getRecipeUploadTarget,
  },
  Recipe: {
    imageKey: recipeTypeResolver.imageKey,
  },
};
