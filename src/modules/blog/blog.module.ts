import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogEntity } from './entities/blog.entity';
import { AuthModule } from '../auth/auth.module';
import { CategoryEntity } from '../category/entities/category.entity';
import { CategoryService } from '../category/category.service';
import { BlogCategoryEntity } from './entities/blog.category.entity';
import { CommentsEntity } from './entities/comment.entity';
import { BlogLikesEntity } from './entities/like.entity';
import { BookmarksEntity } from './entities/bookmark.entity';

@Module({
  imports :[AuthModule,TypeOrmModule.forFeature([BlogEntity,CategoryEntity,BlogCategoryEntity,CommentsEntity,BlogLikesEntity,BookmarksEntity])],
  controllers: [BlogController],
  providers: [BlogService,CategoryService],
})
export class BlogModule {}
