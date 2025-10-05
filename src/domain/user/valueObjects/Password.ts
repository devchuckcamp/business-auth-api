import { ValueObject } from '../../base/ValueObject';
import { ValidationError } from '../../base/DomainError';

interface PasswordProps {
  value: string;
  isHashed: boolean;
}

export class Password extends ValueObject<PasswordProps> {
  private constructor(value: string, isHashed: boolean = false) {
    super({ value, isHashed });
  }

  public static create(plainPassword: string): Password {
    if (!Password.isValid(plainPassword)) {
      throw new ValidationError(
        'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      );
    }
    return new Password(plainPassword, false);
  }

  public static fromHash(hashedPassword: string): Password {
    return new Password(hashedPassword, true);
  }

  public static isValid(password: string): boolean {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return (
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumbers &&
      hasSpecialChar
    );
  }

  public getValue(): string {
    return this.value.value;
  }

  public isHashed(): boolean {
    return this.value.isHashed;
  }
}