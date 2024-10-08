import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from './token.service';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { ProfileEntity } from 'src/modules/user/entities/profile.entity';
import { OtpEntity } from 'src/modules/user/entities/otp.entity';

@Module({
  imports:[TypeOrmModule.forFeature([UserEntity,ProfileEntity,OtpEntity])],
  controllers: [AuthController],
  providers: [AuthService ,JwtService,TokenService],
  exports: [AuthService ,JwtService,TokenService,TypeOrmModule,AuthModule],
})
export class AuthModule {}
 