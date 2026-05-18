import type { Meal } from '../../entities/meal.ts';

export interface ArchiveMealProviderPort {
  archiveMeal(id: string): Promise<Meal>;
}
