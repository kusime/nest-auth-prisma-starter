import { UsersController } from './users.controller';
import { HttpStatus, Logger } from '@nestjs/common';
import { UsersService } from '../prisma/users/users.service';
import { AuthService } from '../auth/auth.service';
import { prismaMock } from '../prisma/test/singleton';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { Test } from '@nestjs/testing';
// controller test
// prepare the dependencies of the controller to be tested with
// mock service implementation since we don't care the severe logic
// then , describe the controller running logic
// and this controller level test not care about the authentication , since we don't need to load the guard and so on
describe('UsersController', () => {
  let controller: UsersController;
  let users_service: UsersService;
  let auth_service: AuthService;
  const test_user = {
    email: 'test@example.com',
    password: 'password',
    name: 'test',
  };
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        Logger,
        JwtService,
        AuthService,
        { provide: PrismaService, useValue: prismaMock },
        UsersService,
      ],
      controllers: [UsersController],
    }).compile();
    auth_service = await module.get<AuthService>(AuthService);
    users_service = await module.get<UsersService>(UsersService);
    controller = await module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('register new user', async () => {
    jest
      .spyOn(users_service, 'createUser')
      .mockResolvedValue({ email: 'test@example.com' });
    expect(await controller.register(test_user)).toEqual({
      info: {
        statusCode: HttpStatus.CREATED,
        message: `Create test@example.com successfully !!`,
      },
      isSuccess: true,
    });
  });

  it('register already existed user', async () => {
    jest.spyOn(users_service, 'createUser').mockResolvedValue(null);
    expect(await controller.register(test_user)).toEqual({
      info: {
        statusCode: HttpStatus.CONFLICT,
        error: `Create User Failed, user already exists`,
      },
      isSuccess: false,
    });
  });

  it('login passed mock', async () => {
    // if the test function is not asynchronous function then use the mockReturnValue to mock the value
    jest.spyOn(auth_service, 'assignToken').mockReturnValue('test_token');
    expect(await controller.login(test_user)).toEqual({
      auth: {
        token_type: 'JWT',
        access_token: 'test_token',
      },
      info: {
        statusCode: HttpStatus.OK,
        message: 'Logging successfully',
      },
      isSuccess: true,
    });
  });
});
