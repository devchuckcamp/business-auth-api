export class UserResponseDto {
  public id!: string;
  public email!: string;
  public firstName?: string;
  public lastName?: string;
  public displayName?: string;
  public avatar?: string;
  public role!: string;
  public status!: string;
  public emailVerified!: boolean;
  public createdAt!: Date;
  public updatedAt!: Date;
  public lastLoginAt?: Date;
}

export class AuthResponseDto {
  public accessToken!: string;
  public refreshToken!: string;
  public user!: UserResponseDto;
  public expiresIn!: number;
}

export class TokenResponseDto {
  public accessToken!: string;
  public refreshToken!: string;
  public expiresIn!: number;
}

export class ProfileResponseDto {
  public id!: string;
  public email!: string;
  public firstName?: string;
  public lastName?: string;
  public displayName?: string;
  public avatar?: string;
  public role!: string;
  public status!: string;
  public emailVerified!: boolean;
  public createdAt!: Date;
  public updatedAt!: Date;
  public lastLoginAt?: Date;
}