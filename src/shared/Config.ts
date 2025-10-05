import dotenv from 'dotenv';
import { join } from 'path';

// Load environment variables
dotenv.config();

export interface DatabaseConfig {
  url: string;
}

export interface JwtConfig {
  accessSecret: string;
  refreshSecret: string;
  accessExpiresIn: string;
  refreshExpiresIn: string;
}

export interface GoogleOAuthConfig {
  clientId: string;
  clientSecret: string;
  callbackUrl: string;
}

export interface SecurityConfig {
  bcryptSaltRounds: number;
  sessionSecret: string;
}

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

export interface ServerConfig {
  port: number;
  nodeEnv: string;
  allowedOrigins: string[];
}

export class Config {
  public static get database(): DatabaseConfig {
    return {
      url: process.env.DATABASE_URL || 'postgresql://username:password@localhost:5432/business_auth_db',
    };
  }

  public static get jwt(): JwtConfig {
    return {
      accessSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
      refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key-change-this-in-production',
      accessExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
      refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    };
  }

  public static get googleOAuth(): GoogleOAuthConfig {
    return {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackUrl: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/auth/google/callback',
    };
  }

  public static get security(): SecurityConfig {
    return {
      bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '12'),
      sessionSecret: process.env.SESSION_SECRET || 'your-session-secret-change-this-in-production',
    };
  }

  public static get rateLimit(): RateLimitConfig {
    return {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
      maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    };
  }

  public static get server(): ServerConfig {
    return {
      port: parseInt(process.env.PORT || '3000'),
      nodeEnv: process.env.NODE_ENV || 'development',
      allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:3001'],
    };
  }

  public static validate(): void {
    const requiredEnvVars = [
      'DATABASE_URL',
      'JWT_SECRET',
      'JWT_REFRESH_SECRET',
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

    if (missingVars.length > 0) {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }

    if (this.server.nodeEnv === 'production') {
      const productionRequiredVars = [
        'GOOGLE_CLIENT_ID',
        'GOOGLE_CLIENT_SECRET',
      ];

      const missingProdVars = productionRequiredVars.filter(varName => !process.env[varName]);

      if (missingProdVars.length > 0) {
        console.warn(`Warning: Missing production environment variables: ${missingProdVars.join(', ')}`);
      }
    }
  }
}