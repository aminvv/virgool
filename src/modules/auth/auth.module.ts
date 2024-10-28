import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from './token.service';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { ProfileEntity } from 'src/modules/user/entities/profile.entity';
import { OtpEntity } from 'src/modules/user/entities/otp.entity';
import { GoogleAuthController } from './google.controller';
import { GoogleStrategy } from './strategy/google.strategy';

@Module({
  imports:[TypeOrmModule.forFeature([UserEntity,ProfileEntity,OtpEntity])],
  controllers: [AuthController,GoogleAuthController],
  providers: [AuthService ,JwtService,TokenService,GoogleStrategy],
  exports: [AuthService ,JwtService,TokenService,TypeOrmModule,AuthModule,GoogleStrategy],
})
export class AuthModule {}
 