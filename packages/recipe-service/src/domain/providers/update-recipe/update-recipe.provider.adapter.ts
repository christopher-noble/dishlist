import 'reflect-metadata';
import type { Recipe } from '../../entities/recipe.ts';
import { RecipeCategory } from '../../entities/recipe.ts';
import { injectable, inject } from 'tsyringe';
import {
  UpdateRecipeProviderPort,
  type UpdateRecipeInput,
} from './update-recipe.provider.port.ts';
import { RepositoryTokens } from '../../../configuration/dependency-registry/tokens/repository-tokens.ts';
import { enumFromKeyStringOrThrow } from '../../../lib/enum-utils.ts';
import { RecipeRepositoryPort, UpdateRecipeInput as RepositoryUpdateRecipeInput } from '../../repositories/recipe-repository.port.ts';
import { normalizeStorageImageKey } from '../../../infrastructure/media/image-key.ts';
import { assertValidRecipeIngredientsForWrite } from '../../recipes/ingredient-schema.ts';
import { RECIPE_CREATE_OPTIONS } from '../../../../config/recipe-create-options.ts';

@injectable()
export class UpdateRecipeProviderAdapter implements UpdateRecipeProviderPort {
  constructor(
    @inject(RepositoryTokens.RecipeRepository)
    private recipeRepository: RecipeRepositoryPort,
  ) {}

  public async updateRecipe(id: string, input: UpdateRecipeInput): Promise<Recipe> {
    const repositoryInput: RepositoryUpdateRecipeInput = {};

    if (input.name !== undefined) {
      repositoryInput.name = input.name;
    }
    if (input.description !== undefined) {
      repositoryInput.description = input.description;
    }
    if (input.imageKey !== undefined) {
      repositoryInput.imageKey =
        input.imageKey === null ? null : normalizeStorageImageKey(input.imageKey);
    }
    if (input.category !== undefined) {
      repositoryInput.category = enumFromKeyStringOrThrow(RecipeCategory, input.category.toUpperCase());
    }
    if (input.ingredients !== undefined) {
      assertValidRecipeIngredientsForWrite(input.ingredients);
      repositoryInput.ingredients = input.ingredients;
    }
    if (input.servesCount !== undefined && input.servesCount !== null) {
      if (input.servesCount < 1 || input.servesCount > RECIPE_CREATE_OPTIONS.maxServes) {
        throw new Error(
          `servesCount must be between 1 and ${RECIPE_CREATE_OPTIONS.maxServes}`,
        );
      }
    }
    if (input.steps !== undefined) {
      repositoryInput.steps = input.steps;
    }
    if (input.servesCount !== undefined) {
      repositoryInput.servesCount = input.servesCount;
    }
    if (input.nutritionalInfo !== undefined) {
      repositoryInput.nutritionalInfo = input.nutritionalInfo;
    }

    return this.recipeRepository.update(id, repositoryInput);
  }
}
