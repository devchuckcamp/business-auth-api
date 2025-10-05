import { IUserRepository } from '../../domain/user/repositories/IUserRepository';
import { User } from '../../domain/user/User';
import { UserId } from '../../domain/user/valueObjects/UserId';
import { Email } from '../../domain/user/valueObjects/Email';
import { UserStatus } from '../../domain/user/valueObjects/UserEnums';
import { DatabaseConnection } from '../database/DatabaseConnection';
import { UserMapper } from './UserMapper';
import { PrismaClient } from '../../generated/prisma';

export class PrismaUserRepository implements IUserRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = DatabaseConnection.getInstance();
  }

  public async save(user: User): Promise<void> {
    const userData = UserMapper.toPersistence(user);
    
    await this.prisma.user.upsert({
      where: { id: user.id.getValue() },
      update: userData,
      create: {
        id: user.id.getValue(),
        ...userData,
      },
    });
  }

  public async findById(id: UserId): Promise<User | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { id: id.getValue() },
      include: {
        authMethods: true,
        sessions: true,
        refreshTokens: true,
      },
    });

    if (!prismaUser) {
      return null;
    }

    return UserMapper.toDomain(prismaUser);
  }

  public async findByEmail(email: Email): Promise<User | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { email: email.getEmailValue() },
      include: {
        authMethods: true,
        sessions: true,
        refreshTokens: true,
      },
    });

    if (!prismaUser) {
      return null;
    }

    return UserMapper.toDomain(prismaUser);
  }

  public async existsByEmail(email: Email): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.getEmailValue() },
      select: { id: true },
    });

    return user !== null;
  }

  public async findActiveUsers(): Promise<User[]> {
    const prismaUsers = await this.prisma.user.findMany({
      where: {
        status: UserStatus.ACTIVE,
        emailVerified: true,
      },
      include: {
        authMethods: true,
        sessions: true,
        refreshTokens: true,
      },
    });

    return prismaUsers.map(UserMapper.toDomain);
  }

  public async delete(id: UserId): Promise<void> {
    await this.prisma.user.delete({
      where: { id: id.getValue() },
    });
  }

  public async count(): Promise<number> {
    return await this.prisma.user.count();
  }

  public async findByEmailDomain(domain: string): Promise<User[]> {
    const prismaUsers = await this.prisma.user.findMany({
      where: {
        email: {
          endsWith: `@${domain}`,
        },
      },
      include: {
        authMethods: true,
        sessions: true,
        refreshTokens: true,
      },
    });

    return prismaUsers.map(UserMapper.toDomain);
  }

  public async updateLastLogin(id: UserId, lastLoginAt: Date): Promise<void> {
    await this.prisma.user.update({
      where: { id: id.getValue() },
      data: { lastLoginAt },
    });
  }
}