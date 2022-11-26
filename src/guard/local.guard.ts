import { AuthGuard } from '@nestjs/passport';
import {
  BadRequestException,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export class LocalGuard extends AuthGuard('local') {
  // use the handleRequest method to intercept the request
  canActivate(ctx: ExecutionContext) {
    // shift to the low-level implementation of passport-local
    const body = ctx.switchToHttp().getRequest().body;
    if (!body['password'] || !body['email']) {
      // missing email or password throw bad request error
      throw new BadRequestException({
        statusCode: 400,
        message: 'Missing Required field',
        required: ['email', 'password'],
      });
    }
    return super.canActivate(ctx);
  }

  handleRequest(err, user, info) {
    // You can throw an exception based on either "info" or "err" arguments
    // user jwt payload
    // this user is come from the local-strategy return
    // console.log('handleRequest Guard >>', err, user, info);
    // Jwt Guard >> false Error: No auth token
    if (err || !user) {
      throw (
        err ||
        new UnauthorizedException({
          statusCode: 401,
          message: 'LocalGuard Authentication Failed',
          error: info,
        })
      );
    }
    return user;
  }
}
