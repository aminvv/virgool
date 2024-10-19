import { Injectable } from '@nestjs/common';
import { ImageDto } from './dto/image.dto';
import { ImageEntity } from './entities/image.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ImageService {
  constructor(@InjectRepository(ImageEntity) private imageRepository:Repository<ImageEntity>){}

  
  create(ImageDto: ImageDto) {
    return 'This action adds a new image';
  }

  findAll() {
    return `This action returns all image`;
  }

  findOne(id: number) {
    return `This action returns a #${id} image`;
  }



  remove(id: number) {
    return `This action removes a #${id} image`;
  }
}
