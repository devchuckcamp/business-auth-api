import { OAuth2Client } from 'google-auth-library';
import { IGoogleOAuthService, GoogleUserProfile } from './IGoogleOAuthService';

export class GoogleOAuthService implements IGoogleOAuthService {
  private client: OAuth2Client;
  private readonly redirectUri: string;

  constructor(
    private readonly clientId: string,
    private readonly clientSecret: string,
    redirectUri: string
  ) {
    this.client = new OAuth2Client(clientId, clientSecret, redirectUri);
    this.redirectUri = redirectUri;
  }

  public async verifyToken(token: string): Promise<GoogleUserProfile | null> {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken: token,
        audience: this.clientId,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        return null;
      }

      return {
        id: payload.sub,
        email: payload.email || '',
        name: payload.name || '',
        given_name: payload.given_name,
        family_name: payload.family_name,
        picture: payload.picture,
        verified_email: payload.email_verified || false,
      };
    } catch (error) {
      console.error('Error verifying Google token:', error);
      return null;
    }
  }

  public getAuthUrl(state?: string): string {
    const scopes = ['openid', 'email', 'profile'];
    const authUrl = this.client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      state,
      prompt: 'consent',
    });

    return authUrl;
  }

  public async exchangeCodeForTokens(code: string): Promise<{ accessToken: string; refreshToken?: string }> {
    try {
      const { tokens } = await this.client.getToken(code);
      
      return {
        accessToken: tokens.access_token || '',
        refreshToken: tokens.refresh_token || undefined,
      };
    } catch (error) {
      console.error('Error exchanging code for tokens:', error);
      throw new Error('Failed to exchange authorization code for tokens');
    }
  }

  public async getUserProfile(accessToken: string): Promise<GoogleUserProfile> {
    try {
      this.client.setCredentials({ access_token: accessToken });
      
      const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user profile from Google');
      }

      const profile = await response.json() as GoogleUserProfile;
      return profile;
    } catch (error) {
      console.error('Error fetching Google user profile:', error);
      throw new Error('Failed to fetch user profile from Google');
    }
  }
}