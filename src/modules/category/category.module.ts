import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { AuthModule } from 'src/modules/auth/auth.module';
import { UserModule } from 'src/modules/user/user.module';
import { BlogEntity } from '../blog/entities/blog.entity';

@Module({
  imports:[
    AuthModule
    ,UserModule
    ,TypeOrmModule.forFeature([CategoryEntity,BlogEntity])
  ],

  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
