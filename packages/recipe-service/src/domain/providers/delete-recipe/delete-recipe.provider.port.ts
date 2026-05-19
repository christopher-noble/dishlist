export interface DeleteRecipeProviderPort {
  deleteRecipe(id: string): Promise<void>;
  deleteAllArchivedRecipes(userId: string): Promise<number>;
}
