import { Module } from '@nestjs/common';

import { ConfigModule } from "@nestjs/config";
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from '../../config/typeormConfig';
@Module({
  imports: [ConfigModule.forRoot({envFilePath:join(process.cwd(),'.env')}),
    TypeOrmModule.forRoot(TypeOrmConfig())
  ],

})
export class AppModule {}
