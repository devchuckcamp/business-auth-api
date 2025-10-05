import { DomainEvent } from './DomainEvent';

export abstract class AggregateRoot<T> {
  protected readonly _id: T;
  private _domainEvents: DomainEvent[] = [];

  constructor(id: T) {
    this._id = id;
  }

  public get id(): T {
    return this._id;
  }

  public get domainEvents(): DomainEvent[] {
    return this._domainEvents;
  }

  protected addDomainEvent(domainEvent: DomainEvent): void {
    this._domainEvents.push(domainEvent);
  }

  public clearEvents(): void {
    this._domainEvents = [];
  }

  public equals(other: AggregateRoot<T>): boolean {
    if (!(other instanceof this.constructor)) {
      return false;
    }
    return this._id === other._id;
  }
}