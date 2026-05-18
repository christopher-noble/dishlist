import type { DependencyContainer } from 'tsyringe';
import { container } from 'tsyringe';

import { registerProviders } from './providers.ts';
import { registerRepositories } from './repositories.ts';

export function registerDependencies(registry: DependencyContainer = container) {
  registerProviders(registry);
  registerRepositories(registry);

  return registry;
}
