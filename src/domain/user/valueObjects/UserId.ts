import { ValueObject } from '../../base/ValueObject';
import { ValidationError } from '../../base/DomainError';

interface UserIdProps {
  value: string;
}

export class UserId extends ValueObject<UserIdProps> {
  constructor(id: string) {
    if (!UserId.isValid(id)) {
      throw new ValidationError('Invalid user ID format');
    }
    super({ value: id });
  }

  public static generate(): UserId {
    return new UserId(crypto.randomUUID());
  }

  public static isValid(id: string): boolean {
    // UUID v4 format validation
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  }

  public getValue(): string {
    return this.value.value;
  }
}