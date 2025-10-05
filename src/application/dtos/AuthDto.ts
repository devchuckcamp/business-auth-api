import { IsEmail, IsString, MinLength, IsOptional, MaxLength } from 'class-validator';

export class RegisterUserDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  public email!: string;

  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(128, { message: 'Password must not exceed 128 characters' })
  public password!: string;

  @IsOptional()
  @IsString({ message: 'First name must be a string' })
  @MaxLength(50, { message: 'First name must not exceed 50 characters' })
  public firstName?: string;

  @IsOptional()
  @IsString({ message: 'Last name must be a string' })
  @MaxLength(50, { message: 'Last name must not exceed 50 characters' })
  public lastName?: string;
}

export class LoginUserDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  public email!: string;

  @IsString({ message: 'Password must be a string' })
  public password!: string;
}

export class GoogleAuthDto {
  @IsString({ message: 'Google token must be a string' })
  public token!: string;
}

export class RefreshTokenDto {
  @IsString({ message: 'Refresh token must be a string' })
  public refreshToken!: string;
}

export class UpdateProfileDto {
  @IsOptional()
  @IsString({ message: 'First name must be a string' })
  @MaxLength(50, { message: 'First name must not exceed 50 characters' })
  public firstName?: string;

  @IsOptional()
  @IsString({ message: 'Last name must be a string' })
  @MaxLength(50, { message: 'Last name must not exceed 50 characters' })
  public lastName?: string;

  @IsOptional()
  @IsString({ message: 'Avatar URL must be a string' })
  @MaxLength(500, { message: 'Avatar URL must not exceed 500 characters' })
  public avatar?: string;
}

export class ChangePasswordDto {
  @IsString({ message: 'Current password must be a string' })
  public currentPassword!: string;

  @IsString({ message: 'New password must be a string' })
  @MinLength(8, { message: 'New password must be at least 8 characters long' })
  @MaxLength(128, { message: 'New password must not exceed 128 characters' })
  public newPassword!: string;
}