import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';

@Injectable()
// what doing here is just implemented a LocalStrategy which implements the passport-local strategy under the hood
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    // http://www.passportjs.org/concepts/authentication/oauth/
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  // validate here is the passport-local callback function , while this callback function is interact with our auth service. however, this is not finished yet
  async validate(username: string, password: string): Promise<string | null> {
    // this will also attach to the go to the local-guard handleRequest() of its user parameter
    // if the return is not null
    return await this.authService.validateUser(username, password);
  }
}
