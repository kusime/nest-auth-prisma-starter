import {
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../prisma/users/users.service';
import { BodyChecker } from '../decorator/request-user.decorator';
import { Prisma } from '@prisma/client';
import { ApiResponse } from '../interface/api-response';
import { LocalGuard } from '../guard/local.guard';
import { AuthService } from '../auth/auth.service';
import { Public } from '../decorator/jwt-public.decorator';
import { jwtPayloadKey } from '../constant/jwtToken';

@Controller('users')
export class UsersController {
  constructor(
    private readonly logger: Logger,
    private readonly users: UsersService,
    private readonly auth: AuthService,
  ) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('register')
  async register(
    @BodyChecker({ check: ['email', 'name', 'password'], isJwt: false })
    clientPost: Prisma.UserCreateInput,
  ): Promise<ApiResponse> {
    // CALLED : service
    const created = await this.users.createUser(clientPost);
    // when create return null mean there already exists
    if (created !== null) {
      this.logger.log(`createUser successfully >> ${created.email}`);
      return {
        info: {
          statusCode: HttpStatus.CREATED,
          message: `Create ${created.email} successfully !!`,
        },
        isSuccess: true,
      };
    } else {
      this.logger.log(`createUser Failed , user already exists`);
      return {
        info: {
          statusCode: HttpStatus.CONFLICT,
          error: `Create User Failed, user already exists`,
        },
        isSuccess: false,
      };
    }
  }

  // since the LocalGuard priority is larger than the Decorator priority
  // so the LocalGuard will automatically check the request body if the username / password is in the request body if not , it will directly throw an 401 error but without any extra data information , but since we had defined the 401 ExceptionFilter , it still can be wrapped with our exception filter that we defined ~
  @Public()
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalGuard)
  @Post('login')
  async login(
    @BodyChecker({ check: ['email', 'password'], isJwt: false })
    body: {
      [jwtPayloadKey]: string;
    },
  ): Promise<ApiResponse> {
    return {
      auth: {
        token_type: 'JWT',
        access_token: this.auth.assignToken(body[jwtPayloadKey]),
      },
      info: {
        statusCode: HttpStatus.OK,
        message: 'Logging successfully',
      },
      isSuccess: true,
    };
  }
}
