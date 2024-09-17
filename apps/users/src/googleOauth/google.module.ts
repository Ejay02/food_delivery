import { Module } from '@nestjs/common';
import { GoogleAuthService } from './google.service';
import { GoogleAuthResolver } from './google.resolver';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';

@Module({
  providers: [
    GoogleAuthService,
    GoogleAuthResolver,
    JwtService,
    UsersService,
    EmailService,
  ],
})
export class GoogleAuthModule {}
