import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/modules/user/user/user.module';

@Module({
  imports:[UserModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
