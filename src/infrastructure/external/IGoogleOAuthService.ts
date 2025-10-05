export interface GoogleUserProfile {
  id: string;
  email: string;
  name: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  verified_email: boolean;
}

export interface IGoogleOAuthService {
  verifyToken(token: string): Promise<GoogleUserProfile | null>;
  getAuthUrl(state?: string): string;
  exchangeCodeForTokens(code: string): Promise<{ accessToken: string; refreshToken?: string }>;
  getUserProfile(accessToken: string): Promise<GoogleUserProfile>;
}