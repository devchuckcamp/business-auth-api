import { DomainEvent } from '../../base/DomainEvent';
import { UserId } from '../valueObjects/UserId';
import { Email } from '../valueObjects/Email';

export class UserRegisteredEvent extends DomainEvent {
  constructor(
    public readonly userId: UserId,
    public readonly email: Email,
    public readonly registrationMethod: string
  ) {
    super();
  }

  public getEventName(): string {
    return 'UserRegisteredEvent';
  }
}

export class UserEmailVerifiedEvent extends DomainEvent {
  constructor(
    public readonly userId: UserId,
    public readonly email: Email
  ) {
    super();
  }

  public getEventName(): string {
    return 'UserEmailVerifiedEvent';
  }
}

export class UserLoggedInEvent extends DomainEvent {
  constructor(
    public readonly userId: UserId,
    public readonly loginMethod: string,
    public readonly ipAddress?: string,
    public readonly userAgent?: string
  ) {
    super();
  }

  public getEventName(): string {
    return 'UserLoggedInEvent';
  }
}

export class UserStatusChangedEvent extends DomainEvent {
  constructor(
    public readonly userId: UserId,
    public readonly oldStatus: string,
    public readonly newStatus: string,
    public readonly reason?: string
  ) {
    super();
  }

  public getEventName(): string {
    return 'UserStatusChangedEvent';
  }
}

export class UserPasswordChangedEvent extends DomainEvent {
  constructor(
    public readonly userId: UserId,
    public readonly changeMethod: string
  ) {
    super();
  }

  public getEventName(): string {
    return 'UserPasswordChangedEvent';
  }
}