import 'reflect-metadata';
import { MealCategory, Meal } from '../../entities/meal.ts';
import { injectable, inject } from 'tsyringe';
import {
  CreateMealProviderPort,
  type CreateMealInput,
} from './create-meal.provider.port.ts';
import { RepositoryTokens } from '../../../configuration/dependency-registry/tokens/repository-tokens.ts';
import { enumFromKeyStringOrThrow } from '../../../lib/enum-utils.ts';
import { MealRepositoryPort } from '../../repositories/meal-repository.port.ts';

@injectable()
export class CreateMealProviderAdapter implements CreateMealProviderPort {
  constructor(
    @inject(RepositoryTokens.MealRepository)
    private mealRepository: MealRepositoryPort,
  ) {}

  public async createMeal(input: CreateMealInput): Promise<Meal> {
    return this.mealRepository.create({
      userId: input.userId,
      name: input.name,
      description: input.description,
      imageUrl: input.imageUrl ?? null,
      category: enumFromKeyStringOrThrow(
        MealCategory,
        input.category.toUpperCase(),
      ),
      ingredients: input.ingredients,
      nutritionalInfo: input.nutritionalInfo ?? null,
    });
  }
}
