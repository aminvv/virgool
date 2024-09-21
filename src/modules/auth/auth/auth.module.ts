import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/modules/user/user/user.module';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from './token.service';

@Module({
  imports:[UserModule],
  controllers: [AuthController],
  providers: [AuthService ,JwtService,TokenService],
  exports: [AuthService ,JwtService,TokenService],
})
export class AuthModule {}
