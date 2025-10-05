import { TokenService, TokenPayload } from '../../domain/user/services/AuthenticationService';
import * as jwt from 'jsonwebtoken';

export class JwtTokenService implements TokenService {
  constructor(
    private readonly accessTokenSecret: string,
    private readonly refreshTokenSecret: string,
    private readonly accessTokenExpiresIn: string = '1h',
    private readonly refreshTokenExpiresIn: string = '7d'
  ) {}

  public async generateAccessToken(userId: string, email: string, role: string): Promise<string> {
    const payload = {
      userId,
      email,
      role,
      type: 'access',
    };

    return jwt.sign(payload, this.accessTokenSecret, {
      expiresIn: this.accessTokenExpiresIn as any,
      issuer: 'business-auth-api',
      audience: 'business-auth-client',
    } as jwt.SignOptions);
  }

  public async generateRefreshToken(userId: string): Promise<string> {
    const payload = {
      userId,
      type: 'refresh',
    };

    return jwt.sign(payload, this.refreshTokenSecret, {
      expiresIn: this.refreshTokenExpiresIn as any,
      issuer: 'business-auth-api',
      audience: 'business-auth-client',
    } as jwt.SignOptions);
  }

  public async verifyAccessToken(token: string): Promise<TokenPayload | null> {
    try {
      const decoded = jwt.verify(token, this.accessTokenSecret, {
        issuer: 'business-auth-api',
        audience: 'business-auth-client',
      }) as any;

      if (decoded.type !== 'access') {
        return null;
      }

      return {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
        iat: decoded.iat,
        exp: decoded.exp,
      };
    } catch (error) {
      console.error('Error verifying access token:', error);
      return null;
    }
  }

  public async verifyRefreshToken(token: string): Promise<string | null> {
    try {
      const decoded = jwt.verify(token, this.refreshTokenSecret, {
        issuer: 'business-auth-api',
        audience: 'business-auth-client',
      }) as any;

      if (decoded.type !== 'refresh') {
        return null;
      }

      return decoded.userId;
    } catch (error) {
      console.error('Error verifying refresh token:', error);
      return null;
    }
  }
}