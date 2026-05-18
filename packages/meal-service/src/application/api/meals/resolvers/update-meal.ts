import { container } from 'tsyringe';
import { ProviderTokens } from '../../../../configuration/dependency-registry/tokens/provider-tokens.ts';
import type { UpdateMealProviderPort, UpdateMealInput } from '../../../../domain/providers/update-meal/update-meal.provider.port.ts';
import { CustomerContext } from '../customer-context.ts';

export interface UpdateMealResolverArgs {
  id: string;
  input: UpdateMealInput;
}

export const updateMealResolver = {
  async updateMeal(
    _: unknown,
    args: UpdateMealResolverArgs,
    _context: CustomerContext,
  ) {
    const updateMealProvider = container.resolve<UpdateMealProviderPort>(
      ProviderTokens.UpdateMealProvider,
    );

    return updateMealProvider.updateMeal(args.id, args.input);
  },
};
