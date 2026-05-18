
import { DependencyContainer, container } from 'tsyringe';
import { CreateUserProviderAdapter } from '../../domain/providers/create-user/create-user.adapter.js';
import { GetHelloProviderAdapter } from '../../domain/providers/get-hello/get.hello.provider.js';
import { ProviderTokens } from './tokens/provider-tokens.js';

export function registerProviders(registry: DependencyContainer = container) {
  registry.registerSingleton(
    ProviderTokens.GetHelloProvider,
    GetHelloProviderAdapter,
  );
  registry.registerSingleton(
    ProviderTokens.CreateUserProvider,
    CreateUserProviderAdapter,
  );

  return registry;
}

