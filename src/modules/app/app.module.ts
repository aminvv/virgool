import { Module } from '@nestjs/common';

import { ConfigModule } from "@nestjs/config";
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from '../../config/typeormConfig';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { CategoryModule } from '../category/category.module';
import { BlogModule } from '../blog/blog.module';
import { ImageModule } from '../image/image.module';
import { CustomHttpModule } from '../http/http.module';
@Module({
  imports: [ConfigModule.forRoot({envFilePath:join(process.cwd(),'.env')}),
    TypeOrmModule.forRoot(TypeOrmConfig()),
    AuthModule,
    UserModule,
    CategoryModule,
    BlogModule,
    ImageModule,
    CustomHttpModule
  ],

})
export class AppModule {}
