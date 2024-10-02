import { Body, Controller, Post } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/blog.dot';
import { swaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
@ApiTags('blog')
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @ApiConsumes(swaggerConsumes.MultiPartData)
  @ApiConsumes(swaggerConsumes.UrlEncoded,swaggerConsumes.Json)
  create(@Body() blogDto:CreateBlogDto){
    return this.blogService.create(blogDto)
  }
}
