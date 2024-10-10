import { Module } from '@nestjs/common';
import { BlogService } from './services/blog.service';
import { BlogController } from './controllers/blog.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogEntity } from './entities/blog.entity';
import { AuthModule } from '../auth/auth.module';
import { CategoryEntity } from '../category/entities/category.entity';
import { CategoryService } from '../category/category.service';
import { BlogCategoryEntity } from './entities/blog.category.entity';
import { CommentsEntity } from './entities/comment.entity';
import { BlogLikesEntity } from './entities/like.entity';
import { BookmarksEntity } from './entities/bookmark.entity';
import { BlogCommentService } from './services/blog-comment.service';
import { BlogCommentController } from './controllers/blog-comment.controller';

@Module({
  imports :[AuthModule,TypeOrmModule.forFeature([BlogEntity,CategoryEntity,BlogCategoryEntity,CommentsEntity,BlogLikesEntity,BookmarksEntity])],
  controllers: [BlogController,BlogCommentController],
  providers: [BlogService,CategoryService,BlogCommentService],
})
export class BlogModule {}
