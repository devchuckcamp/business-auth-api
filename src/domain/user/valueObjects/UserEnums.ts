import { ValueObject } from '../../base/ValueObject';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING',
  SUSPENDED = 'SUSPENDED',
}

export enum AuthProvider {
  LOCAL = 'LOCAL',
  GOOGLE = 'GOOGLE',
  SSO = 'SSO',
}

interface UserRoleProps {
  value: UserRole;
}

interface UserStatusProps {
  value: UserStatus;
}

interface AuthProviderProps {
  value: AuthProvider;
}

export class UserRoleVO extends ValueObject<UserRoleProps> {
  constructor(role: UserRole) {
    super({ value: role });
  }

  public getValue(): UserRole {
    return this.value.value;
  }

  public isAdmin(): boolean {
    return this.value.value === UserRole.ADMIN;
  }

  public isModerator(): boolean {
    return this.value.value === UserRole.MODERATOR;
  }

  public hasAdminPrivileges(): boolean {
    return this.isAdmin() || this.isModerator();
  }
}

export class UserStatusVO extends ValueObject<UserStatusProps> {
  constructor(status: UserStatus) {
    super({ value: status });
  }

  public getValue(): UserStatus {
    return this.value.value;
  }

  public isActive(): boolean {
    return this.value.value === UserStatus.ACTIVE;
  }

  public isPending(): boolean {
    return this.value.value === UserStatus.PENDING;
  }

  public isSuspended(): boolean {
    return this.value.value === UserStatus.SUSPENDED;
  }

  public canAuthenticate(): boolean {
    return this.isActive();
  }
}

export class AuthProviderVO extends ValueObject<AuthProviderProps> {
  constructor(provider: AuthProvider) {
    super({ value: provider });
  }

  public getValue(): AuthProvider {
    return this.value.value;
  }

  public isLocal(): boolean {
    return this.value.value === AuthProvider.LOCAL;
  }

  public isExternal(): boolean {
    return !this.isLocal();
  }
}