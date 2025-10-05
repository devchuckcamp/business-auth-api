import { User } from '../User';
import { UserId } from '../valueObjects/UserId';
import { Email } from '../valueObjects/Email';

export interface IUserRepository {
  save(user: User): Promise<void>;
  findById(id: UserId): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  existsByEmail(email: Email): Promise<boolean>;
  findActiveUsers(): Promise<User[]>;
  delete(id: UserId): Promise<void>;
  count(): Promise<number>;
  findByEmailDomain(domain: string): Promise<User[]>;
  updateLastLogin(id: UserId, lastLoginAt: Date): Promise<void>;
}