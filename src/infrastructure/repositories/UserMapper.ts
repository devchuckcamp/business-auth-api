import { User as PrismaUser, AuthMethod as PrismaAuthMethod } from '../../generated/prisma';
import { User } from '../../domain/user/User';
import { UserId } from '../../domain/user/valueObjects/UserId';
import { Email } from '../../domain/user/valueObjects/Email';
import { UserRoleVO, UserStatusVO, UserRole, UserStatus } from '../../domain/user/valueObjects/UserEnums';

export class UserMapper {
  public static toDomain(prismaUser: PrismaUser & { authMethods?: PrismaAuthMethod[] }): User {
    const userId = new UserId(prismaUser.id);
    const email = new Email(prismaUser.email);
    const role = new UserRoleVO(prismaUser.role as UserRole);
    const status = new UserStatusVO(prismaUser.status as UserStatus);

    return User.fromPersistence(userId, {
      email,
      firstName: prismaUser.firstName || undefined,
      lastName: prismaUser.lastName || undefined,
      displayName: prismaUser.displayName || undefined,
      avatar: prismaUser.avatar || undefined,
      role,
      status,
      emailVerified: prismaUser.emailVerified,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
      lastLoginAt: prismaUser.lastLoginAt || undefined,
    });
  }

  public static toPersistence(user: User): Omit<PrismaUser, 'id'> {
    return {
      email: user.email.getEmailValue(),
      firstName: user.firstName || null,
      lastName: user.lastName || null,
      displayName: user.displayName || null,
      avatar: user.avatar || null,
      role: user.role.getValue(),
      status: user.status.getValue(),
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      lastLoginAt: user.lastLoginAt || null,
    };
  }

  public static toUpdate(user: User): Partial<Omit<PrismaUser, 'id' | 'createdAt'>> {
    return {
      email: user.email.getEmailValue(),
      firstName: user.firstName || null,
      lastName: user.lastName || null,
      displayName: user.displayName || null,
      avatar: user.avatar || null,
      role: user.role.getValue(),
      status: user.status.getValue(),
      emailVerified: user.emailVerified,
      updatedAt: user.updatedAt,
      lastLoginAt: user.lastLoginAt || null,
    };
  }
}