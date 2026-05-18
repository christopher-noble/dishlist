import { container } from 'tsyringe';
import { ProviderTokens } from '../../../../configuration/dependency-registry/tokens/provider-tokens.ts';
import type { ArchiveMealProviderPort } from '../../../../domain/providers/archive-meal/archive-meal.provider.port.ts';
import { CustomerContext } from '../customer-context.ts';

export interface ArchiveMealResolverArgs {
  id: string;
}

export const archiveMealResolver = {
  async archiveMeal(
    _: unknown,
    args: ArchiveMealResolverArgs,
    _context: CustomerContext,
  ) {
    const archiveMealProvider = container.resolve<ArchiveMealProviderPort>(
      ProviderTokens.ArchiveMealProvider,
    );

    return archiveMealProvider.archiveMeal(args.id);
  },
};
