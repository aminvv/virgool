import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { swaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
import { pagination } from 'src/common/decorators/pagination.decorator';
import { paginationDto } from 'src/common/dtos/pagination.dto';

@ApiTags('category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post("/create-category")
  @ApiConsumes(swaggerConsumes.UrlEncoded,swaggerConsumes.MultiPartData)
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @pagination()
  findAll(@Query() paginationDto:paginationDto) {
    return this.categoryService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiConsumes(swaggerConsumes.UrlEncoded,swaggerConsumes.MultiPartData)
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @Patch(':id')
  @ApiConsumes(swaggerConsumes.UrlEncoded,swaggerConsumes.MultiPartData)
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiConsumes(swaggerConsumes.UrlEncoded,swaggerConsumes.MultiPartData)  
  remove(@Param('id') id: string) { 
    return this.categoryService.remove(+id);
  }
}
