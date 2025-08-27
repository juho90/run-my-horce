import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';

export const UserId = createParamDecorator(
  (required: boolean = true, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const userId = req.headers['x-user-id'];
    if (!userId && required) {
      throw new BadRequestException('x-user-id header missing');
    }
    return userId;
  },
);
