import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../prisma/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    // Use JwtService to assign
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<string> {
    const findUser = await this.users.findUserByIdOrEmail({
      email,
    });
    if (findUser === null) {
      throw new UnauthorizedException('User not found.');
    }
    if (await bcrypt.compare(password, findUser.password)) {
      // https://stackabuse.com/how-to-filter-an-object-by-key-in-javascript/
      return findUser.email;
    } else {
      throw new UnauthorizedException('Password mismatch.');
    }
  }

  assignToken(email: string): string {
    return this.jwtService.sign({ email });
  }
  // {
  //   "username": "ming@gmail.com",
  //   "iat": 1669206334,
  //   "exp": 1669206394
  // }
}
