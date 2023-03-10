import { UsersService } from './users.service';
import { prismaMock } from '../test/singleton';
import { User } from '@prisma/client';
import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { Logger } from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';
import { PrismaService } from '../prisma.service';

// this level of testing is aim to be able to check the data reveal is correct,
// and we use the mock prisma client , so this might not be able to check error like
// the main key is duplicated ... since in here we are not connect to the database actually
describe('UsersService', () => {
  let service: UsersService;
  const user: User = {
    email: 'test@example.com',
    id: 'test',
    password: 'password',
    name: 'test',
  };
  beforeEach(async () => {
    // https://www.prisma.io/docs/guides/testing/unit-testing#dependency-injection
    // prepare the prisma context
    // prepare the prisma context
    const module = await Test.createTestingModule({
      providers: [
        Logger,
        JwtService,
        AuthService,
        { provide: PrismaService, useValue: prismaMock },
        UsersService,
      ],
    }).compile();
    service = await module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('createUser: should be null when findUserByIdOrEmail is returning user', async () => {
    // set the mock retrieve
    prismaMock.user.findUnique.mockResolvedValue(user);
    await expect(service.createUser(user)).resolves.toEqual(null);
  });

  it('createUser: should be return user when findUserByIdOrEmail is returning null', async () => {
    // set the mock retrieve
    prismaMock.user.findUnique.mockResolvedValue(null);
    prismaMock.user.create.mockResolvedValue(user);
    await expect(service.createUser(user)).resolves.toEqual(user);
  });
});
