import { container } from 'tsyringe';
import { ProviderTokens } from '../../../../configuration/dependency-registry/tokens/provider-tokens.ts';
import type { MealProviderPort } from '../../../../domain/providers/meal/meal.provider.port.ts';
import { CustomerContext } from '../customer-context.ts';

export interface MealsQueryResolverArgs {
  userId: string;
}

export const mealsResolver = {
  async meals(
    _: unknown,
    args: MealsQueryResolverArgs,
    _context: CustomerContext,
  ) {
    const mealProvider = container.resolve<MealProviderPort>(
      ProviderTokens.MealProvider,
    );

    return mealProvider.getActiveMealsByUserId(args.userId);
  },

  async archivedMeals(
    _: unknown,
    args: MealsQueryResolverArgs,
    _context: CustomerContext,
  ) {
    const mealProvider = container.resolve<MealProviderPort>(
      ProviderTokens.MealProvider,
    );

    return mealProvider.getArchivedMealsByUserId(args.userId);
  },
};
