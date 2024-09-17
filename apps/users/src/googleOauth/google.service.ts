import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { OAuth2Client } from 'google-auth-library';
import { UsersService } from '../users/users.service';

@Injectable()
export class GoogleAuthService {
  private googleClient: OAuth2Client;

  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    this.googleClient = new OAuth2Client(
      this.configService.get<string>('GOOGLE_CLIENT_ID'),
      this.configService.get<string>('GOOGLE_CLIENT_SECRET'),
      this.configService.get<string>('GOOGLE_REDIRECT_URI'),
    );
  }

  async exchangeCodeForTokens(code: string) {
    try {
      const redirectUri = this.configService.get<string>('GOOGLE_REDIRECT_URI');

      const { tokens } = await this.googleClient.getToken({
        code,
        redirect_uri: redirectUri,
      });

      // Verify the ID token
      const ticket = await this.googleClient.verifyIdToken({
        idToken: tokens.id_token,
        audience: this.configService.get<string>('GOOGLE_CLIENT_ID'),
      });

      const payload = ticket.getPayload();

      if (!payload) {
        throw new BadRequestException('Invalid Google token');
      }

      // Call the googleSignIn method with the payload
      const { email, name, picture } = payload;
      const signInResult = await this.usersService.googleSignIn({
        email,
        name,
        picture,
      });

      return { ...signInResult, googleTokens: tokens };
    } catch (error) {
      throw new BadRequestException('Failed to validate Code');
    }
  }

  generateAccessToken(user: any): string {
    return this.jwtService.sign(
      {
        id: user.id,
        email: user.email,
      },
      {
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
        expiresIn: '15m',
      },
    );
  }

  generateRefreshToken(user: any): string {
    return this.jwtService.sign(
      { id: user.id },
      {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
        expiresIn: '7d',
      },
    );
  }

  async updateRefreshToken(id: string, refreshToken: string) {
    await this.usersService.updateUser(id, { refreshToken });
  }
}
