import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorator/jwt-public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      // if canActivate returns true then will pass this activation
      return true;
    }
    // shift to the low-level implementation of passport-jwt
    return super.canActivate(context);
  }
  // this handleRequest will set the Request.user
  handleRequest(err, user, jwt_info) {
    // You can throw an exception based on either "info" or "err" arguments
    // user jwt payload
    // console.log('Jwt Guard >>', err, user, jwt_info);
    // Jwt Guard >> false Error: No auth token
    if (err || !user) {
      throw (
        err ||
        new UnauthorizedException({
          statusCode: 401,
          message: 'Jwt Authentication Failed',
          error: jwt_info,
        })
      );
    }
    return user;
  }
}
