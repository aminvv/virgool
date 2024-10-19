import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageDto } from './dto/image.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('image')
@ApiTags('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post()
  create(@Body() createImageDto: ImageDto) {
    return this.imageService.create(createImageDto);
  }

  @Get()
  findAll() {
    return this.imageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.imageService.findOne(+id);
  }



  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.imageService.remove(+id);
  }
}
