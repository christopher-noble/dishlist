import 'reflect-metadata';
import type { Meal } from '../../entities/meal.ts';
import { injectable, inject } from 'tsyringe';
import { ArchiveMealProviderPort } from './archive-meal.provider.port.ts';
import { RepositoryTokens } from '../../../configuration/dependency-registry/tokens/repository-tokens.ts';
import { MealRepositoryPort } from '../../repositories/meal-repository.port.ts';

@injectable()
export class ArchiveMealProviderAdapter implements ArchiveMealProviderPort {
  constructor(
    @inject(RepositoryTokens.MealRepository)
    private mealRepository: MealRepositoryPort,
  ) {}

  public async archiveMeal(id: string): Promise<Meal> {
    return this.mealRepository.archive(id);
  }
}
