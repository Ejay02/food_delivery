import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class GoogleLoginInput {
  @Field()
  code: string;
  // token: string;
  @Field({ nullable: true })
  accessToken?: string;

  @Field({ nullable: true })
  refreshToken?: string;
}
