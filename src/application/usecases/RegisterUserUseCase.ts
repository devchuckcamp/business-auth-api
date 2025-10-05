import { IUserRepository } from '../../domain/user/repositories/IUserRepository';
import { User } from '../../domain/user/User';
import { Email } from '../../domain/user/valueObjects/Email';
import { Password } from '../../domain/user/valueObjects/Password';
import { UserRole } from '../../domain/user/valueObjects/UserEnums';
import { ConflictError, ValidationError } from '../../domain/base/DomainError';
import { RegisterUserDto } from '../dtos/AuthDto';
import { AuthResponseDto, UserResponseDto } from '../dtos/UserDto';
import { PasswordService, TokenService } from '../../domain/user/services/AuthenticationService';
import bcryptjs from 'bcryptjs';

export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService
  ) {}

  public async execute(dto: RegisterUserDto): Promise<AuthResponseDto> {
    // Validate input
    const email = new Email(dto.email);
    const password = Password.create(dto.password);

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    // Create new user
    const user = User.create(
      email,
      dto.firstName,
      dto.lastName,
      UserRole.USER
    );

    // Hash password and create auth method
    const hashedPassword = await this.passwordService.hash(password);
    
    // Save user
    await this.userRepository.save(user);

    // Generate tokens
    const accessToken = await this.tokenService.generateAccessToken(
      user.id.getValue(),
      user.email.getEmailValue(),
      user.role.getValue()
    );

    const refreshToken = await this.tokenService.generateRefreshToken(
      user.id.getValue()
    );

    // Return response
    return {
      accessToken,
      refreshToken,
      expiresIn: 3600, // 1 hour
      user: this.mapUserToDto(user),
    };
  }

  private mapUserToDto(user: User): UserResponseDto {
    return {
      id: user.id.getValue(),
      email: user.email.getEmailValue(),
      firstName: user.firstName,
      lastName: user.lastName,
      displayName: user.displayName,
      avatar: user.avatar,
      role: user.role.getValue(),
      status: user.status.getValue(),
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      lastLoginAt: user.lastLoginAt,
    };
  }
}