import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import checkObjectFieldPassed from '../functions/check-obj-field';
import checkObjNull from '../functions/check-obj-null';
import { jwtPayloadKey } from '../constant/jwtToken';

export const BodyChecker = createParamDecorator(
  (
    data: { check: string[]; isJwt: boolean; retCTX?: true | undefined },
    ctx: ExecutionContext,
  ) => {
    console.log('BodyChecker called');
    // data the data that passed to the decorator
    const request = ctx.switchToHttp().getRequest();
    const body = request.body; // this will auto convert to the object type
    const required = data.check;
    if (checkObjNull(body))
      throw new BadRequestException({
        message: 'Empty Body Request !',
        required: required,
      });
    if (!checkObjectFieldPassed(body, required)) {
      throw new BadRequestException({
        message: 'Request body is not matching the rule that was expected',
        required,
      });
    }
    // decorator wil need to return the identifier
    console.log('Guard Passed check >', request.user);
    if (data.isJwt) {
      // get the username form jwt
      body[jwtPayloadKey] = request.user[jwtPayloadKey];
    }
    if (data.retCTX) {
      return ctx;
    }
    return body;
  },
);
