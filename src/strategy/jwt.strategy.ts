import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants, jwtPayloadKey } from '../constant/jwtToken';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // get token from the header
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }
  // payload is jwt load
  async validate(payload: any) {
    // if the JwtGuard is passed
    // var key = "name";
    // var person = {[key]:"John"}; // same as var person = {"name" : "John"}
    // this will pass in to the Request.user object
    return { [jwtPayloadKey]: payload[jwtPayloadKey] };
  }
}
