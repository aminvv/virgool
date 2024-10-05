import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/blog.dto';
import { swaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guard/auth.guard';
import { paginationDto } from 'src/common/dtos/pagination.dto';
import { SkipAuth } from 'src/common/decorators/skip-auth.decorators';
@ApiTags('blog')
@Controller('blog')
@ApiBearerAuth("Authorization")
@UseGuards(AuthGuard)
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post('/')
  @ApiConsumes(swaggerConsumes.MultiPartData)
  @ApiConsumes(swaggerConsumes.UrlEncoded,swaggerConsumes.Json)
  create(@Body() blogDto:CreateBlogDto){
    return this.blogService.create(blogDto)
  }


  @Get('/my')
  myBlogs(){
    return this.blogService.myBlog()
  }


  @Get('/')
  @SkipAuth()
  find(@Query() paginationDto:paginationDto){
    return this.blogService.blogList(paginationDto)
  }
  
}
