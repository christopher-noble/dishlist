import { container } from 'tsyringe';
import { ProviderTokens } from '../../../../configuration/dependency-registry/tokens/provider-tokens.ts';
import type { CreateMealProviderPort, CreateMealInput } from '../../../../domain/providers/create-meal/create-meal.provider.port.ts';
import { CustomerContext } from '../customer-context.ts';

export interface CreateMealResolverArgs {
  input: CreateMealInput;
}

export const createMealResolver = {
  async createMeal(
    _: unknown,
    args: CreateMealResolverArgs,
    _context: CustomerContext,
  ) {
    const createMealProvider = container.resolve<CreateMealProviderPort>(
      ProviderTokens.CreateMealProvider,
    );

    return createMealProvider.createMeal(args.input);
  },
};
