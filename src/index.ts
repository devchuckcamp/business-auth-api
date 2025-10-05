import 'reflect-metadata';
import { Config } from './shared/Config';
import { Container } from './shared/Container';
import { DatabaseConnection } from './infrastructure/database/DatabaseConnection';
import { App } from './presentation/App';

async function bootstrap(): Promise<void> {
  try {
    console.log('🚀 Starting Business Auth API...');

    // Validate configuration
    Config.validate();
    console.log('✅ Configuration validated');

    // Connect to database
    await DatabaseConnection.connect();
    console.log('✅ Database connected');

    // Check database health
    const isHealthy = await DatabaseConnection.healthCheck();
    if (!isHealthy) {
      throw new Error('Database health check failed');
    }
    console.log('✅ Database health check passed');

    // Initialize dependency injection container
    const container = Container.getInstance();
    console.log('✅ Dependency injection container initialized');

    // Create and start the application
    const app = new App(
      Config.server.port,
      container.authRoutes
    );

    await app.start();
    console.log('✅ Application started successfully');

    // Graceful shutdown handling
    process.on('SIGTERM', async () => {
      console.log('📝 SIGTERM received, shutting down gracefully...');
      await DatabaseConnection.disconnect();
      process.exit(0);
    });

    process.on('SIGINT', async () => {
      console.log('📝 SIGINT received, shutting down gracefully...');
      await DatabaseConnection.disconnect();
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Failed to start application:', error);
    await DatabaseConnection.disconnect();
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('🚨 Uncaught Exception:', error);
  process.exit(1);
});

// Start the application
bootstrap();