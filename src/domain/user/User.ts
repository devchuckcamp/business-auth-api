import { AggregateRoot } from '../base/AggregateRoot';
import { ValidationError, ConflictError } from '../base/DomainError';
import { UserId } from './valueObjects/UserId';
import { Email } from './valueObjects/Email';
import { Password } from './valueObjects/Password';
import { UserRoleVO, UserStatusVO, UserRole, UserStatus } from './valueObjects/UserEnums';
import {
  UserRegisteredEvent,
  UserEmailVerifiedEvent,
  UserLoggedInEvent,
  UserStatusChangedEvent,
  UserPasswordChangedEvent,
} from './events/UserEvents';

interface UserProps {
  email: Email;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  avatar?: string;
  role: UserRoleVO;
  status: UserStatusVO;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

export class User extends AggregateRoot<UserId> {
  private props: UserProps;

  private constructor(id: UserId, props: UserProps) {
    super(id);
    this.props = props;
  }

  public static create(
    email: Email,
    firstName?: string,
    lastName?: string,
    role: UserRole = UserRole.USER
  ): User {
    const userId = UserId.generate();
    const userRole = new UserRoleVO(role);
    const userStatus = new UserStatusVO(UserStatus.PENDING);
    const now = new Date();

    const user = new User(userId, {
      email,
      firstName,
      lastName,
      displayName: firstName && lastName ? `${firstName} ${lastName}` : firstName,
      role: userRole,
      status: userStatus,
      emailVerified: false,
      createdAt: now,
      updatedAt: now,
    });

    user.addDomainEvent(
      new UserRegisteredEvent(userId, email, 'local')
    );

    return user;
  }

  public static fromPersistence(
    id: UserId,
    props: UserProps
  ): User {
    return new User(id, props);
  }

  // Getters
  public get email(): Email {
    return this.props.email;
  }

  public get firstName(): string | undefined {
    return this.props.firstName;
  }

  public get lastName(): string | undefined {
    return this.props.lastName;
  }

  public get displayName(): string | undefined {
    return this.props.displayName;
  }

  public get avatar(): string | undefined {
    return this.props.avatar;
  }

  public get role(): UserRoleVO {
    return this.props.role;
  }

  public get status(): UserStatusVO {
    return this.props.status;
  }

  public get emailVerified(): boolean {
    return this.props.emailVerified;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt;
  }

  public get lastLoginAt(): Date | undefined {
    return this.props.lastLoginAt;
  }

  // Business methods
  public updateProfile(
    firstName?: string,
    lastName?: string,
    avatar?: string
  ): void {
    this.props.firstName = firstName;
    this.props.lastName = lastName;
    this.props.avatar = avatar;
    this.props.displayName = firstName && lastName ? `${firstName} ${lastName}` : firstName;
    this.props.updatedAt = new Date();
  }

  public verifyEmail(): void {
    if (this.props.emailVerified) {
      throw new ConflictError('Email is already verified');
    }

    this.props.emailVerified = true;
    this.props.updatedAt = new Date();

    // If user was pending and email is verified, activate the account
    if (this.props.status.getValue() === UserStatus.PENDING) {
      this.activate();
    }

    this.addDomainEvent(
      new UserEmailVerifiedEvent(this.id, this.props.email)
    );
  }

  public activate(): void {
    if (this.props.status.getValue() === UserStatus.ACTIVE) {
      throw new ConflictError('User is already active');
    }

    const oldStatus = this.props.status.getValue();
    this.props.status = new UserStatusVO(UserStatus.ACTIVE);
    this.props.updatedAt = new Date();

    this.addDomainEvent(
      new UserStatusChangedEvent(this.id, oldStatus, UserStatus.ACTIVE)
    );
  }

  public suspend(reason?: string): void {
    if (this.props.status.getValue() === UserStatus.SUSPENDED) {
      throw new ConflictError('User is already suspended');
    }

    const oldStatus = this.props.status.getValue();
    this.props.status = new UserStatusVO(UserStatus.SUSPENDED);
    this.props.updatedAt = new Date();

    this.addDomainEvent(
      new UserStatusChangedEvent(this.id, oldStatus, UserStatus.SUSPENDED, reason)
    );
  }

  public deactivate(): void {
    if (this.props.status.getValue() === UserStatus.INACTIVE) {
      throw new ConflictError('User is already inactive');
    }

    const oldStatus = this.props.status.getValue();
    this.props.status = new UserStatusVO(UserStatus.INACTIVE);
    this.props.updatedAt = new Date();

    this.addDomainEvent(
      new UserStatusChangedEvent(this.id, oldStatus, UserStatus.INACTIVE)
    );
  }

  public recordLogin(ipAddress?: string, userAgent?: string): void {
    if (!this.props.status.canAuthenticate()) {
      throw new ValidationError('User cannot authenticate in current status');
    }

    this.props.lastLoginAt = new Date();
    this.props.updatedAt = new Date();

    this.addDomainEvent(
      new UserLoggedInEvent(this.id, 'local', ipAddress, userAgent)
    );
  }

  public changeRole(newRole: UserRole): void {
    this.props.role = new UserRoleVO(newRole);
    this.props.updatedAt = new Date();
  }

  public canPerformAction(requiredRole: UserRole): boolean {
    if (requiredRole === UserRole.ADMIN) {
      return this.props.role.isAdmin();
    }
    if (requiredRole === UserRole.MODERATOR) {
      return this.props.role.hasAdminPrivileges();
    }
    return true; // USER level access
  }

  public isActive(): boolean {
    return this.props.status.isActive() && this.props.emailVerified;
  }
}