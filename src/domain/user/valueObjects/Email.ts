import { ValueObject } from '../../base/ValueObject';
import { ValidationError } from '../../base/DomainError';

interface EmailProps {
  value: string;
}

export class Email extends ValueObject<EmailProps> {
  constructor(email: string) {
    if (!Email.isValid(email)) {
      throw new ValidationError('Invalid email format');
    }
    super({ value: email.toLowerCase() });
  }

  public static isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  }

  public getEmailValue(): string {
    return this.value.value;
  }

  public getDomain(): string {
    return this.value.value.split('@')[1] || '';
  }
}