import 'reflect-metadata';
import { RecipeCategory, Recipe } from '../../entities/recipe.ts';
import { injectable, inject } from 'tsyringe';
import {
  CreateRecipeProviderPort,
  type CreateRecipeInput,
} from './create-recipe.provider.port.ts';
import { RepositoryTokens } from '../../../configuration/dependency-registry/tokens/repository-tokens.ts';
import { enumFromKeyStringOrThrow } from '../../../lib/enum-utils.ts';
import { RecipeRepositoryPort } from '../../repositories/recipe-repository.port.ts';
import { assertValidRecipeIngredientsForWrite } from '../../recipes/ingredient-schema.ts';
import { RECIPE_CREATE_OPTIONS } from '../../../../config/recipe-create-options.ts';

@injectable()
export class CreateRecipeProviderAdapter implements CreateRecipeProviderPort {
  constructor(
    @inject(RepositoryTokens.RecipeRepository)
    private recipeRepository: RecipeRepositoryPort,
  ) {}

  public async createRecipe(input: CreateRecipeInput): Promise<Recipe> {
    assertValidRecipeIngredientsForWrite(input.ingredients);

    if (
      input.servesCount != null &&
      (input.servesCount < 1 || input.servesCount > RECIPE_CREATE_OPTIONS.maxServes)
    ) {
      throw new Error(
        `servesCount must be between 1 and ${RECIPE_CREATE_OPTIONS.maxServes}`,
      );
    }

    return this.recipeRepository.create({
      userId: input.userId,
      name: input.name,
      description: input.description,
      imageKey: input.imageKey ?? null,
      category: enumFromKeyStringOrThrow(
        RecipeCategory,
        input.category.toUpperCase(),
      ),
      ingredients: input.ingredients,
      steps: input.steps,
      servesCount: input.servesCount ?? null,
      nutritionalInfo: input.nutritionalInfo ?? null,
    });
  }
}
