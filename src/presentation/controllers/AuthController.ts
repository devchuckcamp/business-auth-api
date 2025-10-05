import { Request, Response, NextFunction } from 'express';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { RegisterUserDto, LoginUserDto, GoogleAuthDto } from '../../application/dtos/AuthDto';
import { RegisterUserUseCase } from '../../application/usecases/RegisterUserUseCase';
import { LoginUserUseCase } from '../../application/usecases/LoginUserUseCase';
import { GoogleAuthUseCase } from '../../application/usecases/GoogleAuthUseCase';

export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly googleAuthUseCase: GoogleAuthUseCase
  ) {}

  public register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = plainToClass(RegisterUserDto, req.body);
      const errors = await validate(dto);

      if (errors.length > 0) {
        res.status(400).json({
          error: 'Validation failed',
          details: errors.map(error => ({
            field: error.property,
            messages: Object.values(error.constraints || {}),
          })),
        });
        return;
      }

      const result = await this.registerUserUseCase.execute(dto);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = plainToClass(LoginUserDto, req.body);
      const errors = await validate(dto);

      if (errors.length > 0) {
        res.status(400).json({
          error: 'Validation failed',
          details: errors.map(error => ({
            field: error.property,
            messages: Object.values(error.constraints || {}),
          })),
        });
        return;
      }

      const ipAddress = req.ip;
      const userAgent = req.get('User-Agent');

      const result = await this.loginUserUseCase.execute(dto, ipAddress, userAgent);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  public googleAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = plainToClass(GoogleAuthDto, req.body);
      const errors = await validate(dto);

      if (errors.length > 0) {
        res.status(400).json({
          error: 'Validation failed',
          details: errors.map(error => ({
            field: error.property,
            messages: Object.values(error.constraints || {}),
          })),
        });
        return;
      }

      const ipAddress = req.ip;
      const userAgent = req.get('User-Agent');

      const result = await this.googleAuthUseCase.execute(dto, ipAddress, userAgent);

      res.status(200).json({
        success: true,
        message: 'Google authentication successful',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  public getGoogleAuthUrl = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const state = req.query.state as string || Math.random().toString(36).substring(7);
      
      // Construct Google OAuth URL
      const baseUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
      const params = new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID || '',
        redirect_uri: process.env.GOOGLE_CALLBACK_URL || '',
        scope: 'openid email profile',
        response_type: 'code',
        state: state,
        prompt: 'consent',
        access_type: 'offline',
      });

      const authUrl = `${baseUrl}?${params.toString()}`;

      res.status(200).json({
        success: true,
        message: 'Google OAuth URL generated',
        data: {
          authUrl,
          state,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // TODO: Implement token invalidation
      res.status(200).json({
        success: true,
        message: 'Logout successful',
      });
    } catch (error) {
      next(error);
    }
  };

  public refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // TODO: Implement refresh token logic
      res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  public googleCallback = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { code, state, error } = req.query;

      // Handle OAuth errors
      if (error) {
        res.status(400).send(`
          <!DOCTYPE html>
          <html>
          <head><title>OAuth Error</title></head>
          <body>
            <h1>Authentication Error</h1>
            <p>Error: ${error}</p>
            <p>Description: ${req.query.error_description || 'Unknown error occurred'}</p>
            <a href="/">Return to Homepage</a>
          </body>
          </html>
        `);
        return;
      }

      if (!code) {
        res.status(400).send(`
          <!DOCTYPE html>
          <html>
          <head><title>OAuth Error</title></head>
          <body>
            <h1>Authentication Error</h1>
            <p>Authorization code is required</p>
            <a href="/">Return to Homepage</a>
          </body>
          </html>
        `);
        return;
      }

      // Create a GoogleAuthDto with the authorization code
      const dto = plainToClass(GoogleAuthDto, {
        token: code as string,
      });

      const errors = await validate(dto);

      if (errors.length > 0) {
        res.status(400).send(`
          <!DOCTYPE html>
          <html>
          <head><title>Validation Error</title></head>
          <body>
            <h1>Validation Error</h1>
            <p>Invalid authorization code format</p>
            <a href="/">Return to Homepage</a>
          </body>
          </html>
        `);
        return;
      }

      const result = await this.googleAuthUseCase.execute(dto, req.ip, req.get('User-Agent'));

      // Success response with user-friendly HTML
      res.status(200).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Login Successful</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
            .success { color: #28a745; }
            .token { background: #f8f9fa; padding: 10px; border-radius: 5px; word-break: break-all; margin: 10px 0; }
            .copy-btn { padding: 5px 10px; background: #007bff; color: white; border: none; border-radius: 3px; cursor: pointer; }
          </style>
        </head>
        <body>
          <h1 class="success">✅ Google Login Successful!</h1>
          <h2>Welcome, ${result.user.displayName || result.user.firstName}!</h2>
          
          <h3>Your Authentication Tokens:</h3>
          <p><strong>Access Token:</strong></p>
          <div class="token" id="accessToken">${result.accessToken}</div>
          <button class="copy-btn" onclick="copyToClipboard('accessToken')">Copy Access Token</button>
          
          <p><strong>Refresh Token:</strong></p>
          <div class="token" id="refreshToken">${result.refreshToken}</div>
          <button class="copy-btn" onclick="copyToClipboard('refreshToken')">Copy Refresh Token</button>
          
          <h3>User Information:</h3>
          <ul>
            <li><strong>ID:</strong> ${result.user.id}</li>
            <li><strong>Email:</strong> ${result.user.email}</li>
            <li><strong>Name:</strong> ${result.user.firstName} ${result.user.lastName}</li>
            <li><strong>Role:</strong> ${result.user.role}</li>
            <li><strong>Email Verified:</strong> ${result.user.emailVerified ? 'Yes' : 'No'}</li>
          </ul>
          
          <h3>Next Steps:</h3>
          <p>Use the access token in your API requests by adding this header:</p>
          <div class="token">Authorization: Bearer YOUR_ACCESS_TOKEN</div>
          
          <script>
            function copyToClipboard(elementId) {
              const element = document.getElementById(elementId);
              const text = element.textContent;
              navigator.clipboard.writeText(text).then(() => {
                alert('Token copied to clipboard!');
              });
            }
          </script>
        </body>
        </html>
      `);
    } catch (error) {
      console.error('Google callback error:', error);
      res.status(500).send(`
        <!DOCTYPE html>
        <html>
        <head><title>Authentication Error</title></head>
        <body>
          <h1>Authentication Failed</h1>
          <p>An error occurred during authentication. Please try again.</p>
          <p>Error: ${error instanceof Error ? error.message : 'Unknown error'}</p>
          <a href="/">Return to Homepage</a>
        </body>
        </html>
      `);
    }
  };
}