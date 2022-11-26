import { Module } from '@nestjs/common';

import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../constant/jwtToken';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  // this module will directly load all service bundled in PrismaModule
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [PassportModule, AuthService],
  exports: [AuthService],
  // Exports the AuthService to let app.modules work  correctly
})
export class AuthModule {}
