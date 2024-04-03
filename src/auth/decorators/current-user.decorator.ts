import { User } from '@app/user/user.schema';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: any | undefined, ctx: ExecutionContext) => {
    const user: Express.Request & { user: User } = ctx
      .switchToHttp()
      .getRequest().user;
    return data ? user[data] : user;
  },
);
