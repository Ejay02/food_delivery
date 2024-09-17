import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class GoogleLoginInput {
  @Field()
  code: string;
  // token: string;
}
