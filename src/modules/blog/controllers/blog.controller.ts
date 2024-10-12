import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { BlogService } from '../services/blog.service';
import { CreateBlogDto, filterBlogDto, updateBlogDto } from '../dto/blog.dto';
import { swaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../auth/guard/auth.guard';
import { paginationDto } from 'src/common/dtos/pagination.dto';
import { SkipAuth } from 'src/common/decorators/skip-auth.decorators';
import { pagination } from 'src/common/decorators/pagination.decorator';
import { FilterBlog } from 'src/common/decorators/filter.decorator ';
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
  @pagination()
  @FilterBlog()
  find(@Query() paginationDto:paginationDto , @Query() filterDto:filterBlogDto){
    return this.blogService.blogList(paginationDto,filterDto)
  }

  @Delete('/my:id')
  delete(@Param("id",ParseIntPipe) id:number){
    return this.blogService.delete(id)
  }
 
  
  @Put('/:id')
  @ApiConsumes(swaggerConsumes.UrlEncoded,swaggerConsumes.Json)
  update(@Param("id",ParseIntPipe) id:number,@Body() blogDto:updateBlogDto){
    return this.blogService.update(id,blogDto)
  }



  @Get('/like:id')
  likeToggle(@Param("id",ParseIntPipe) id:number){
    return this.blogService.likeToggle(id)
  }


  @Get('/bookmark:id')
  bookmarkToggle(@Param("id",ParseIntPipe) id:number){
    return this.blogService.bookmarkToggle(id)
  }

  @Get('/by-slug/:slug')
  findOneBySlug(@Param("slug") slug:string){
    return this.blogService.findOneBySlug(slug)

  }

}
