import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { GoogleAuthService } from './google.service';
import { GoogleLoginInput } from '../dto/google.oauth.dto';
import { GoogleLoginResponse } from '../types/google.oauth.types';

@Resolver()
export class GoogleAuthResolver {
  constructor(private readonly googleAuthService: GoogleAuthService) {}

  @Mutation(() => GoogleLoginResponse)
  async googleLogin(
    @Args('googleLoginInput') googleLoginInput: GoogleLoginInput,
  ) {
    return this.googleAuthService.exchangeCodeForTokens(googleLoginInput.code);
  }
}
