import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';

export class AuthRoutes {
  private router: Router;

  constructor(private readonly authController: AuthController) {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // Local authentication routes
    this.router.post('/register', this.authController.register);
    this.router.post('/login', this.authController.login);
    this.router.post('/logout', this.authController.logout);
    this.router.post('/refresh', this.authController.refreshToken);

    // OAuth routes
    this.router.get('/google/url', this.authController.getGoogleAuthUrl);
    this.router.post('/google', this.authController.googleAuth);
    
    // Google OAuth callback route
    this.router.get('/google/callback', this.authController.googleCallback);

    // Health check for auth service
    this.router.get('/health', (req, res) => {
      res.status(200).json({
        success: true,
        message: 'Auth service is healthy',
        timestamp: new Date().toISOString(),
      });
    });
  }

  public getRouter(): Router {
    return this.router;
  }
}