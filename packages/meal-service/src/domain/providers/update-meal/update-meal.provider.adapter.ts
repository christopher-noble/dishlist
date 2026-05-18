import 'reflect-metadata';
import type { Meal } from '../../entities/meal.ts';
import { MealCategory } from '../../entities/meal.ts';
import { injectable, inject } from 'tsyringe';
import {
  UpdateMealProviderPort,
  type UpdateMealInput,
} from './update-meal.provider.port.ts';
import { RepositoryTokens } from '../../../configuration/dependency-registry/tokens/repository-tokens.ts';
import { enumFromKeyStringOrThrow } from '../../../lib/enum-utils.ts';
import { MealRepositoryPort, UpdateMealInput as RepositoryUpdateMealInput } from '../../repositories/meal-repository.port.ts';

@injectable()
export class UpdateMealProviderAdapter implements UpdateMealProviderPort {
  constructor(
    @inject(RepositoryTokens.MealRepository)
    private mealRepository: MealRepositoryPort,
  ) {}

  public async updateMeal(id: string, input: UpdateMealInput): Promise<Meal> {
    const repositoryInput: RepositoryUpdateMealInput = {};

    if (input.name !== undefined) {
      repositoryInput.name = input.name;
    }
    if (input.description !== undefined) {
      repositoryInput.description = input.description;
    }
    if (input.imageUrl !== undefined) {
      repositoryInput.imageUrl = input.imageUrl;
    }
    if (input.category !== undefined) {
      repositoryInput.category = enumFromKeyStringOrThrow(MealCategory, input.category.toUpperCase());
    }
    if (input.ingredients !== undefined) {
      repositoryInput.ingredients = input.ingredients;
    }
    if (input.nutritionalInfo !== undefined) {
      repositoryInput.nutritionalInfo = input.nutritionalInfo;
    }

    return this.mealRepository.update(id, repositoryInput);
  }
}
