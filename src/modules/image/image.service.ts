import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { ImageDto } from './dto/image.dto';
import { ImageEntity } from './entities/image.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MulterFile } from 'src/common/utils/multer.util';
import { NotFoundMessage, publicMessage } from 'src/common/enums/message.enum';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class ImageService {
  constructor(@InjectRepository(ImageEntity) private imageRepository: Repository<ImageEntity>,
    @Inject(REQUEST) private request: Request
  ) { }

  async create(imageDto: ImageDto, image: MulterFile) {
    const userId = this.request.user.id
    const { alt, name } = imageDto
    let location = image?.path?.slice(7)
    await this.imageRepository.insert({
      alt: alt || name,
      name,
      location: location,
      userId,
    })
    return {
      message: publicMessage.created
    }
  }

  async findAll(){
    const userId=this.request.user.id
    return await this.imageRepository.find({
      where:{userId},
      order:{id:"DESC"}
    })
  }

  async findOne(id:number){
    const userId=this.request.user.id
    const image=await this.imageRepository.findOne({
      where:{userId,id},
      order:{id:"DESC"}
    })
    if(!image)throw new NotFoundException(NotFoundMessage.NotFound);
    return image

    
  }

  async remove(id:number){
    const image=await this.findOne(id)
    await this.imageRepository.remove(image)
    return{
      message:publicMessage.Delete
    }
  }


}
