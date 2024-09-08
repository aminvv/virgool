import { Module } from '@nestjs/common';

import { ConfigModule } from "@nestjs/config";
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from '../../config/typeormConfig';
import { UserModule } from '../user/user/user.module';
import { AuthModule } from '../auth/auth/auth.module';
@Module({
  imports: [ConfigModule.forRoot({envFilePath:join(process.cwd(),'.env')}),
    TypeOrmModule.forRoot(TypeOrmConfig()),
    AuthModule,
    UserModule,
  ],

})
export class AppModule {}
