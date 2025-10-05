import { PrismaClient } from '../../generated/prisma';

export class DatabaseConnection {
  private static instance: PrismaClient;

  public static getInstance(): PrismaClient {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new PrismaClient({
        log: ['query', 'info', 'warn', 'error'],
      });
    }
    return DatabaseConnection.instance;
  }

  public static async connect(): Promise<void> {
    try {
      await DatabaseConnection.getInstance().$connect();
      console.log('Database connected successfully');
    } catch (error) {
      console.error('Failed to connect to database:', error);
      throw error;
    }
  }

  public static async disconnect(): Promise<void> {
    try {
      await DatabaseConnection.getInstance().$disconnect();
      console.log('Database disconnected successfully');
    } catch (error) {
      console.error('Failed to disconnect from database:', error);
      throw error;
    }
  }

  public static async healthCheck(): Promise<boolean> {
    try {
      await DatabaseConnection.getInstance().$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }
}