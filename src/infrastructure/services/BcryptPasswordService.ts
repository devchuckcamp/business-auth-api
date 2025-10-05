import { PasswordService } from '../../domain/user/services/AuthenticationService';
import { Password } from '../../domain/user/valueObjects/Password';
import bcryptjs from 'bcryptjs';

export class BcryptPasswordService implements PasswordService {
  constructor(private readonly saltRounds: number = 12) {}

  public async hash(password: Password): Promise<string> {
    const salt = await bcryptjs.genSalt(this.saltRounds);
    return await bcryptjs.hash(password.getValue(), salt);
  }

  public async verify(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcryptjs.compare(plainPassword, hashedPassword);
  }

  public generateTemporary(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let result = '';
    for (let i = 0; i < 12; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}