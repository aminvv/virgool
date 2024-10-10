import { Body, Controller,  Param,  Post,  UseGuards } from '@nestjs/common';
import { BlogService } from '../services/blog.service';
import { CreateBlogDto } from '../dto/blog.dto';
import { swaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../auth/guard/auth.guard';
import { BlogCommentDto } from '../dto/blog-comment.dto';
import { identity } from 'rxjs';
import { BlogCommentService } from '../services/blog-comment.service';

@ApiTags('blog')
@Controller('blog-comment')
@ApiBearerAuth("Authorization")
@UseGuards(AuthGuard)
export class BlogCommentController {
  constructor(private readonly blogCommentService: BlogCommentService) {}

  @Post('/')
  @ApiConsumes(swaggerConsumes.UrlEncoded,swaggerConsumes.Json)
  create(@Body() blogCommentDto:BlogCommentDto ){
    return this.blogCommentService.create(blogCommentDto)
  }



}
