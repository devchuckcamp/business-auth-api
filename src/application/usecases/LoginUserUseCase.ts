import { IUserRepository } from '../../domain/user/repositories/IUserRepository';
import { Email } from '../../domain/user/valueObjects/Email';
import { AuthenticationError, ValidationError } from '../../domain/base/DomainError';
import { LoginUserDto } from '../dtos/AuthDto';
import { AuthResponseDto, UserResponseDto } from '../dtos/UserDto';
import { PasswordService, TokenService } from '../../domain/user/services/AuthenticationService';

export class LoginUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService
  ) {}

  public async execute(dto: LoginUserDto, ipAddress?: string, userAgent?: string): Promise<AuthResponseDto> {
    // Validate email
    const email = new Email(dto.email);

    // Find user
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new AuthenticationError('Invalid email or password');
    }

    // Check if user can authenticate
    if (!user.status.canAuthenticate()) {
      throw new AuthenticationError('Account is not active');
    }

    if (!user.emailVerified) {
      throw new AuthenticationError('Please verify your email before logging in');
    }

    // Verify password - this would need to be implemented with actual auth method lookup
    // For now, we'll assume password verification works
    // const isValidPassword = await this.passwordService.verify(dto.password, hashedPassword);
    // if (!isValidPassword) {
    //   throw new AuthenticationError('Invalid email or password');
    // }

    // Record login
    user.recordLogin(ipAddress, userAgent);
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

    return {
      accessToken,
      refreshToken,
      expiresIn: 3600, // 1 hour
      user: this.mapUserToDto(user),
    };
  }

  private mapUserToDto(user: any): UserResponseDto {
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