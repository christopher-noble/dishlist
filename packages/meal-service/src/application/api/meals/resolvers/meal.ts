import { container } from 'tsyringe';
import { ProviderTokens } from '../../../../configuration/dependency-registry/tokens/provider-tokens.ts';
import type { MealProviderPort } from '../../../../domain/providers/meal/meal.provider.port.ts';
import { CustomerContext } from '../customer-context.ts';

export interface MealQueryResolverArgs {
  id: string;
}

export const mealResolver = {
  async meal(
    _: unknown,
    args: MealQueryResolverArgs,
    _context: CustomerContext,
  ) {
    const mealProvider = container.resolve<MealProviderPort>(
      ProviderTokens.MealProvider,
    );

    return mealProvider.getMealById(args.id);
  },
};
