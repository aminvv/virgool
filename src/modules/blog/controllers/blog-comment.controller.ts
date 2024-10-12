import { Body, Controller,  Get,  Param,  Post,  Query,  UseGuards } from '@nestjs/common';
import { BlogService } from '../services/blog.service';
import { CreateBlogDto } from '../dto/blog.dto';
import { swaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../auth/guard/auth.guard';
import { BlogCommentDto } from '../dto/blog-comment.dto';
import { identity } from 'rxjs';
import { BlogCommentService } from '../services/blog-comment.service';
import { pagination } from 'src/common/decorators/pagination.decorator';
import { paginationDto } from 'src/common/dtos/pagination.dto';

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

  
  @Get('/findComment')
  @pagination()
  findComment(@Query() pagination:paginationDto){
    return this.blogCommentService.findComment(pagination)
  }



}
