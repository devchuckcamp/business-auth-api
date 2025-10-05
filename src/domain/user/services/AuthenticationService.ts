import { Password } from '../valueObjects/Password';

export interface PasswordService {
  hash(password: Password): Promise<string>;
  verify(plainPassword: string, hashedPassword: string): Promise<boolean>;
  generateTemporary(): string;
}

export interface TokenService {
  generateAccessToken(userId: string, email: string, role: string): Promise<string>;
  generateRefreshToken(userId: string): Promise<string>;
  verifyAccessToken(token: string): Promise<TokenPayload | null>;
  verifyRefreshToken(token: string): Promise<string | null>; // Returns userId
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export interface EmailService {
  sendVerificationEmail(email: string, token: string): Promise<void>;
  sendPasswordResetEmail(email: string, token: string): Promise<void>;
  sendWelcomeEmail(email: string, firstName?: string): Promise<void>;
}

export interface AuditService {
  logAuthenticationAttempt(
    email: string,
    success: boolean,
    method: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void>;
  
  logUserAction(
    userId: string,
    action: string,
    resource: string,
    details?: Record<string, unknown>,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void>;
}