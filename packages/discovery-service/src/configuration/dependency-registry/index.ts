import type { DependencyContainer } from 'tsyringe';
import { container } from 'tsyringe';

import { registerProviders } from './providers.js';
import { registerRepositories } from './repositories.js';

export function registerDependencies(registry: DependencyContainer = container) {
  registerProviders(registry);
  registerRepositories(registry);

  return registry;
}
