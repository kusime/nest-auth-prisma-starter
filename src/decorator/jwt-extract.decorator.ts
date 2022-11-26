import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { jwtPayloadKey } from '../constant/jwtToken';

export const JwtExtract = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    // data the data that passed to the decorator
    const request = ctx.switchToHttp().getRequest();
    const jwtPayload = request.user; // this will auto convert to the object type
    return jwtPayload[jwtPayloadKey];
  },
);
