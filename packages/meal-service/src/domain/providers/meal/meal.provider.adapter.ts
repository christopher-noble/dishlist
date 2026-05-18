import 'reflect-metadata';
import type { Meal } from '../../entities/meal.ts';
import { injectable, inject } from 'tsyringe';
import { MealProviderPort } from './meal.provider.port.ts';
import { RepositoryTokens } from '../../../configuration/dependency-registry/tokens/repository-tokens.ts';
import { MealRepositoryPort } from '../../repositories/meal-repository.port.ts';

@injectable()
export class MealProviderAdapter implements MealProviderPort {
  constructor(
    @inject(RepositoryTokens.MealRepository)
    private mealRepository: MealRepositoryPort,
  ) {}

  public async getMealById(id: string): Promise<Meal | null> {
    return this.mealRepository.findById(id);
  }

  public async getActiveMealsByUserId(userId: string): Promise<Meal[]> {
    return this.mealRepository.findActiveByUserId(userId);
  }

  public async getArchivedMealsByUserId(userId: string): Promise<Meal[]> {
    return this.mealRepository.findArchivedByUserId(userId);
  }
}
