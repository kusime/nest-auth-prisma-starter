import { AuthService } from './auth.service';
import { UsersService } from '../prisma/users/users.service';
import { prismaMock } from '../prisma/test/singleton';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;
  let users_service: UsersService;
  beforeEach(async () => {
    users_service = new UsersService(prismaMock);
    service = new AuthService(users_service, new JwtService());
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
