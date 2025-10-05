// Dependency Injection Container
import { IUserRepository } from '../domain/user/repositories/IUserRepository';
import { PasswordService, TokenService } from '../domain/user/services/AuthenticationService';
import { IGoogleOAuthService } from '../infrastructure/external/IGoogleOAuthService';

import { PrismaUserRepository } from '../infrastructure/repositories/PrismaUserRepository';
import { BcryptPasswordService } from '../infrastructure/services/BcryptPasswordService';
import { JwtTokenService } from '../infrastructure/services/JwtTokenService';
import { GoogleOAuthService } from '../infrastructure/external/GoogleOAuthService';

import { RegisterUserUseCase } from '../application/usecases/RegisterUserUseCase';
import { LoginUserUseCase } from '../application/usecases/LoginUserUseCase';
import { GoogleAuthUseCase } from '../application/usecases/GoogleAuthUseCase';

import { AuthController } from '../presentation/controllers/AuthController';
import { AuthRoutes } from '../presentation/routes/AuthRoutes';

import { Config } from './Config';

export class Container {
  private static instance: Container;
  
  // Repositories
  private _userRepository?: IUserRepository;
  
  // Services
  private _passwordService?: PasswordService;
  private _tokenService?: TokenService;
  private _googleOAuthService?: IGoogleOAuthService;
  
  // Use Cases
  private _registerUserUseCase?: RegisterUserUseCase;
  private _loginUserUseCase?: LoginUserUseCase;
  private _googleAuthUseCase?: GoogleAuthUseCase;
  
  // Controllers
  private _authController?: AuthController;
  
  // Routes
  private _authRoutes?: AuthRoutes;

  public static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  // Repositories
  public get userRepository(): IUserRepository {
    if (!this._userRepository) {
      this._userRepository = new PrismaUserRepository();
    }
    return this._userRepository;
  }

  // Services
  public get passwordService(): PasswordService {
    if (!this._passwordService) {
      this._passwordService = new BcryptPasswordService(Config.security.bcryptSaltRounds);
    }
    return this._passwordService;
  }

  public get tokenService(): TokenService {
    if (!this._tokenService) {
      const jwtConfig = Config.jwt;
      this._tokenService = new JwtTokenService(
        jwtConfig.accessSecret,
        jwtConfig.refreshSecret,
        jwtConfig.accessExpiresIn,
        jwtConfig.refreshExpiresIn
      );
    }
    return this._tokenService;
  }

  public get googleOAuthService(): IGoogleOAuthService {
    if (!this._googleOAuthService) {
      const googleConfig = Config.googleOAuth;
      this._googleOAuthService = new GoogleOAuthService(
        googleConfig.clientId,
        googleConfig.clientSecret,
        googleConfig.callbackUrl
      );
    }
    return this._googleOAuthService;
  }

  // Use Cases
  public get registerUserUseCase(): RegisterUserUseCase {
    if (!this._registerUserUseCase) {
      this._registerUserUseCase = new RegisterUserUseCase(
        this.userRepository,
        this.passwordService,
        this.tokenService
      );
    }
    return this._registerUserUseCase;
  }

  public get loginUserUseCase(): LoginUserUseCase {
    if (!this._loginUserUseCase) {
      this._loginUserUseCase = new LoginUserUseCase(
        this.userRepository,
        this.passwordService,
        this.tokenService
      );
    }
    return this._loginUserUseCase;
  }

  public get googleAuthUseCase(): GoogleAuthUseCase {
    if (!this._googleAuthUseCase) {
      this._googleAuthUseCase = new GoogleAuthUseCase(
        this.userRepository,
        this.googleOAuthService,
        this.tokenService
      );
    }
    return this._googleAuthUseCase;
  }

  // Controllers
  public get authController(): AuthController {
    if (!this._authController) {
      this._authController = new AuthController(
        this.registerUserUseCase,
        this.loginUserUseCase,
        this.googleAuthUseCase
      );
    }
    return this._authController;
  }

  // Routes
  public get authRoutes(): AuthRoutes {
    if (!this._authRoutes) {
      this._authRoutes = new AuthRoutes(this.authController);
    }
    return this._authRoutes;
  }
}