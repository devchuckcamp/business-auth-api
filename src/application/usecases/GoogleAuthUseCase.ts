import { IUserRepository } from '../../domain/user/repositories/IUserRepository';
import { User } from '../../domain/user/User';
import { Email } from '../../domain/user/valueObjects/Email';
import { UserRole } from '../../domain/user/valueObjects/UserEnums';
import { IGoogleOAuthService, GoogleUserProfile } from '../../infrastructure/external/IGoogleOAuthService';
import { GoogleAuthDto } from '../dtos/AuthDto';
import { AuthResponseDto, UserResponseDto } from '../dtos/UserDto';
import { TokenService } from '../../domain/user/services/AuthenticationService';
import { AuthenticationError } from '../../domain/base/DomainError';

export class GoogleAuthUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly googleOAuthService: IGoogleOAuthService,
    private readonly tokenService: TokenService
  ) {}

  public async execute(dto: GoogleAuthDto, ipAddress?: string, userAgent?: string): Promise<AuthResponseDto> {
    // Check if this is an authorization code or ID token
    if (dto.token.startsWith('4/') || dto.token.includes('code=')) {
      // This is an authorization code, handle OAuth flow
      return this.handleOAuthFlow(dto.token, ipAddress, userAgent);
    } else {
      // This is an ID token, verify directly
      return this.handleIdTokenFlow(dto.token, ipAddress, userAgent);
    }
  }

  public async handleOAuthFlow(authCode: string, ipAddress?: string, userAgent?: string): Promise<AuthResponseDto> {
    try {
      // Exchange authorization code for tokens
      const tokens = await this.googleOAuthService.exchangeCodeForTokens(authCode);
      
      // Get user profile using access token
      const googleProfile = await this.googleOAuthService.getUserProfile(tokens.accessToken);
      
      if (!googleProfile || !googleProfile.verified_email) {
        throw new AuthenticationError('Invalid Google profile or unverified email');
      }

      return this.processGoogleUser(googleProfile, ipAddress, userAgent);
    } catch (error) {
      console.error('Error in OAuth flow:', error);
      throw new AuthenticationError('Failed to authenticate with Google');
    }
  }

  public async handleIdTokenFlow(idToken: string, ipAddress?: string, userAgent?: string): Promise<AuthResponseDto> {
    // Verify Google ID token
    const googleProfile = await this.googleOAuthService.verifyToken(idToken);
    if (!googleProfile) {
      throw new AuthenticationError('Invalid Google token');
    }

    if (!googleProfile.verified_email) {
      throw new AuthenticationError('Google email must be verified');
    }

    return this.processGoogleUser(googleProfile, ipAddress, userAgent);
  }

  private async processGoogleUser(googleProfile: GoogleUserProfile, ipAddress?: string, userAgent?: string): Promise<AuthResponseDto> {
    const email = new Email(googleProfile.email);

    // Find or create user
    let user = await this.userRepository.findByEmail(email);
    
    if (!user) {
      // Create new user from Google profile
      user = User.create(
        email,
        googleProfile.given_name,
        googleProfile.family_name,
        UserRole.USER
      );

      // Update with Google profile info
      user.updateProfile(
        googleProfile.given_name,
        googleProfile.family_name,
        googleProfile.picture
      );

      // Auto-verify email for Google users
      user.verifyEmail();

      await this.userRepository.save(user);
    } else {
      // Record login for existing user
      user.recordLogin(ipAddress, userAgent);
      await this.userRepository.save(user);
    }

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