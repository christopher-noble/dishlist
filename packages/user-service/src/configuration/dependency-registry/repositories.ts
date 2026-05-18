
import { container, DependencyContainer } from 'tsyringe';
import type { UserRepositoryPort } from '../../domain/repositories/user-repository.port.js';
import { UserRepositoryAdapter } from '../../infrastructure/repositories/user/user-repository.adapter.js';
import { RepositoryTokens } from './tokens/repository-tokens.js';

export function registerRepositories(registry: DependencyContainer = container) {
  registry.register<UserRepositoryPort>(RepositoryTokens.UserRepository, {
    useClass: UserRepositoryAdapter,
  });

  return registry;
}