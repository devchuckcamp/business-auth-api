import { User } from '../User';
import { Email } from '../valueObjects/Email';
import { UserRepository } from '../repositories/UserRepository';
import { ConflictError, ValidationError } from '../../base/DomainError';

export class UserDomainService {
  constructor(private readonly userRepository: UserRepository) {}

  public async validateUniqueEmail(email: Email, excludeUserId?: string): Promise<void> {
    const existingUser = await this.userRepository.findByEmail(email);
    
    if (existingUser && (!excludeUserId || existingUser.id.getValue() !== excludeUserId)) {
      throw new ConflictError('Email is already registered');
    }
  }

  public async canUserPerformAction(user: User, action: string): Promise<boolean> {
    // Business rules for user permissions
    if (!user.isActive()) {
      return false;
    }

    // Example permission logic
    switch (action) {
      case 'CREATE_USER':
      case 'DELETE_USER':
        return user.role.isAdmin();
      case 'MODERATE_CONTENT':
        return user.role.hasAdminPrivileges();
      case 'UPDATE_PROFILE':
        return user.isActive();
      default:
        return true;
    }
  }

  public validateUserForAuthentication(user: User): void {
    if (!user.status.canAuthenticate()) {
      throw new ValidationError('User account is not in a valid state for authentication');
    }

    if (!user.emailVerified) {
      throw new ValidationError('Email must be verified before authentication');
    }
  }
}