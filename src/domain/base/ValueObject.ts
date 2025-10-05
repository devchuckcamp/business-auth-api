export abstract class ValueObject<T> {
  protected readonly _value: T;

  constructor(value: T) {
    this._value = Object.freeze(value);
  }

  public equals(other: ValueObject<T>): boolean {
    if (!(other instanceof this.constructor)) {
      return false;
    }
    return JSON.stringify(this._value) === JSON.stringify(other._value);
  }

  public get value(): T {
    return this._value;
  }

  public toString(): string {
    return JSON.stringify(this._value);
  }
}