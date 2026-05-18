import type { User } from '../entities/user.js';

export interface UserRepositoryPort {
  create(user: Omit<User, 'id' | 'authUserId'>): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByAuthUserId(authUserId: string): Promise<User | null>;
}
