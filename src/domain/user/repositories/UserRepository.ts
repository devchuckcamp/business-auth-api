import { Repository } from '../../base/Repository';
import { User } from '../User';
import { UserId } from '../valueObjects/UserId';
import { Email } from '../valueObjects/Email';

export interface UserRepository extends Repository<User, UserId> {
  findByEmail(email: Email): Promise<User | null>;
  findByEmailString(email: string): Promise<User | null>;
  existsByEmail(email: Email): Promise<boolean>;
  findActiveUsers(): Promise<User[]>;
  findByRole(role: string): Promise<User[]>;
}

export interface AuthMethodRepository {
  findByUserId(userId: UserId): Promise<AuthMethod[]>;
  findByProviderAndIdentifier(provider: string, identifier: string): Promise<AuthMethod | null>;
  save(authMethod: AuthMethod): Promise<AuthMethod>;
  delete(id: string): Promise<void>;
}

export interface SessionRepository {
  findByToken(token: string): Promise<Session | null>;
  findByUserId(userId: UserId): Promise<Session[]>;
  save(session: Session): Promise<Session>;
  deleteExpired(): Promise<void>;
  deleteByUserId(userId: UserId): Promise<void>;
}

// Temporary interfaces for AuthMethod and Session - these would be proper domain entities
interface AuthMethod {
  id: string;
  userId: string;
  provider: string;
  identifier: string;
}

interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
}