import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { json, urlencoded } from 'express';
import { AuthRoutes } from './routes/AuthRoutes';
import { errorHandler } from './middleware/ErrorHandler';
import { Container } from '../shared/Container';
import 'reflect-metadata';

export class App {
  private app: Application;
  private port: number;

  constructor(
    port: number,
    private readonly authRoutes: AuthRoutes
  ) {
    this.app = express();
    this.port = port;
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  private setupMiddleware(): void {
    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
    }));

    // CORS configuration
    this.app.use(cors({
      origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
      max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
      message: {
        error: 'Too many requests',
        message: 'Too many requests from this IP, please try again later.',
      },
      standardHeaders: true,
      legacyHeaders: false,
    });

    this.app.use('/api', limiter);

    // Body parsing middleware
    this.app.use(json({ limit: '10mb' }));
    this.app.use(urlencoded({ extended: true, limit: '10mb' }));

    // Trust proxy for accurate IP addresses
    this.app.set('trust proxy', 1);

    // Request logging (simple)
    this.app.use((req, res, next) => {
      console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - ${req.ip}`);
      next();
    });
  }

  private setupRoutes(): void {
    // Health check endpoint
    this.app.get('/health', (req: Request, res: Response) => {
      res.status(200).json({
        success: true,
        message: 'Business Auth API is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      });
    });

    // API routes
    this.app.use('/api/auth', this.authRoutes.getRouter());

    // Google OAuth callback route (direct route for Google's redirect)
    this.app.get('/auth/google/callback', async (req: Request, res: Response) => {
      try {
        // Get the auth controller from the container
        const container = Container.getInstance();
        const authController = container.authController;
        
        // Forward to the auth controller's callback method
        await authController.googleCallback(req, res, (error: any) => {
          if (error) {
            res.status(500).json({
              error: 'Internal Server Error',
              message: 'OAuth callback failed',
              timestamp: new Date().toISOString(),
            });
          }
        });
      } catch (error) {
        console.error('OAuth callback error:', error);
        res.status(500).json({
          error: 'Internal Server Error',
          message: 'OAuth callback failed',
          timestamp: new Date().toISOString(),
        });
      }
    });

    // Catch-all route for undefined endpoints
    this.app.use((req: Request, res: Response) => {
      res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.originalUrl} not found`,
        timestamp: new Date().toISOString(),
      });
    });
  }

  private setupErrorHandling(): void {
    this.app.use(errorHandler);
  }

  public async start(): Promise<void> {
    return new Promise((resolve) => {
      this.app.listen(this.port, () => {
        console.log(`🚀 Business Auth API is running on port ${this.port}`);
        console.log(`📖 API Documentation: http://localhost:${this.port}/health`);
        console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
        resolve();
      });
    });
  }

  public getApp(): Application {
    return this.app;
  }
}