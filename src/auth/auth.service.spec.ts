import { AuthService } from './auth.service';
import { prismaMock } from '../prisma/test/singleton';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from './auth.module';
import { PassportModule } from '@nestjs/passport';
import { jwtConstants } from '../constant/jwtToken';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

describe('AuthService', () => {
  let service: AuthService;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
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
      providers: [
        Logger,
        JwtService,
        { provide: PrismaService, useValue: prismaMock },
        AuthService,
      ],
    }).compile();
    service = await module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
