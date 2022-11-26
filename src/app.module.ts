import { Logger, Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsersController } from './users/users.controller';
import { TodosController } from './todos/todos.controller';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { BadRequestFilter } from './filter/bad-request/bad-request.filter';
import { LocalGuard } from './guard/local.guard';
import { LocalStrategy } from './strategy/local-passport.strategy';
import { AuthModule } from './auth/auth.module';
import { UnauthorizedFilter } from './filter/unauthorized/unauthorized.filter';
import { JwtAuthGuard } from './guard/jwt.guard';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constant/jwtToken';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    // load the JwtModule to prepare the AuthService JwtService
    PassportModule,
    // register JwtModule globally
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '600s' },
    }),
  ],
  controllers: [UsersController, TodosController],
  providers: [
    JwtStrategy, // passport-jwt strategy for build JwtGuard
    LocalStrategy, // passport-local strategy for build LocalGuard
    LocalGuard, // provider for the passport-local
    Logger, // provide for build Filter
    // register global Filters
    {
      provide: APP_FILTER,
      useClass: BadRequestFilter,
    },
    {
      provide: APP_FILTER,
      useClass: UnauthorizedFilter,
    },
    // global guard
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
