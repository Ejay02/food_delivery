import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  ActivationDto,
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
} from './dto/user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { EmailService } from './email/email.service';
import { TokenSender } from './utils/sendToken';
import { User } from '@prisma/client';

interface UserData {
  name: string;
  email: string;
  password: string;
  phone_number: number;
}

@Injectable()
export class UsersService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user by email
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    // Return early if user is not found or password is incorrect
    if (!user || !(await this.comparePassword(password, user.password))) {
      throw new BadRequestException('Invalid email or password');
    }

    try {
      // Create and send token
      const tokenSender = new TokenSender(this.configService, this.jwtService);
      return tokenSender.sendToken(user);
    } catch (error) {
      throw new InternalServerErrorException('Unable to generate token');
    }
  }

  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  // register user
  async register(registerDto: RegisterDto, response: Response) {
    const { name, email, password, phone_number } = registerDto;

    const emailExists = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (emailExists) {
      throw new BadRequestException('User with this email already exist.');
    }

    const noExist = await this.prisma.user.findFirst({
      where: {
        phone_number,
      },
    });

    if (noExist) {
      throw new BadRequestException('User with this number already exist.');
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = {
        name,
        email,
        password: hashedPassword,
        phone_number,
      };

      const activationToken = await this.createActivationToken(user);

      const activationCode = activationToken.activationCode;

      const activation_token = activationToken.token;

      await this.emailService.sendMail({
        email,
        subject: 'Activate you account',
        template: './activation-mail',
        name,
        activationCode,
      });

      return { activation_token, response };
    } catch (error) {
      throw new BadRequestException('Error registering this user.', error);
    }
  }

  //activation token
  async createActivationToken(user: UserData) {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

    const token = this.jwtService.sign(
      {
        user,
        activationCode,
      },
      {
        secret: this.configService.get<string>('ACTIVATION_SECRET'),
        expiresIn: '5m',
      },
    );

    return { token, activationCode };
  }

  // activate user
  async activateUser(activationDto: ActivationDto, response: Response) {
    const { activationToken, activationCode } = activationDto;

    const newUser: { user: UserData; activationCode: string } =
      this.jwtService.verify(activationToken, {
        secret: this.configService.get<string>('ACTIVATION_SECRET'),
      } as JwtVerifyOptions) as { user: UserData; activationCode: string };

    if (newUser.activationCode !== activationCode) {
      throw new BadRequestException('Invalid activation code');
    }

    const { name, email, password, phone_number } = newUser.user;

    const existUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existUser) {
      throw new BadRequestException('User already exist with this email');
    }

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password,
        phone_number,
      },
    });

    return { user, response };
  }

  async authUser(req: any) {
    try {
      const user = req.user;
      const refreshToken = req.refreshtoken;
      const accessToken = req.accesstoken;

      return { user, accessToken, refreshToken };
    } catch (error) {
      throw new BadRequestException('Error validating user', error.message);
    }
  }

  async logout(req: any) {
    req.user = null;
    req.refreshtoken = null;
    req.accesstoken = null;

    return { message: 'Logged out successfully!' };
  }

  async forgotPasswordLink(user: User) {
    const forgotPasswordToken = this.jwtService.sign(
      { user },
      {
        secret: this.configService.get<string>('FORGOT_PASSWORD_SECRET'),
        expiresIn: '5m',
      },
    );
    return forgotPasswordToken;
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;

    // Find user by email
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('No user found with this email');
    }

    const forgotPasswordToken = await this.forgotPasswordLink(user);

    const resetPasswordUrl =
      this.configService.get<string>('FRONTEND_URL') +
      `/reset-password?verify=${forgotPasswordToken}`;

    await this.emailService.sendMail({
      email,
      subject: 'Reset your password',
      template: './forgot-password',
      name: user.name,
      activationCode: resetPasswordUrl,
    });
    return { message: 'Forgot password request successful' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { password, activationToken } = resetPasswordDto;

    const decoded = await this.jwtService.decode(activationToken);

    if (!decoded || decoded?.exp * 1000 < Date.now()) {
      throw new BadRequestException('Invalid token.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.update({
      where: {
        id: decoded.user.id,
      },
      data: {
        password: hashedPassword,
      },
    });

    return { user };
  }

  // get all
  async getUsers() {
    return this.prisma.user.findMany({});
  }
}
