import { Module } from '@nestjs/common';

import { ConfigModule } from "@nestjs/config";
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from '../../config/typeormConfig';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { CategoryModule } from '../category/category.module';
@Module({
  imports: [ConfigModule.forRoot({envFilePath:join(process.cwd(),'.env')}),
    TypeOrmModule.forRoot(TypeOrmConfig()),
    AuthModule,
    UserModule,
    CategoryModule,
  ],

})
export class AppModule {}
