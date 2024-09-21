import { ConflictException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { Repository } from 'typeorm';
import {  ConflictMessage, publicMessage } from 'src/common/enums/message.enum';

@Injectable()
export class CategoryService {


  constructor(@InjectRepository(CategoryEntity)private categoryRepository:Repository<CategoryEntity>){}
  async create(createCategoryDto: CreateCategoryDto) {
    let {priority,title}=createCategoryDto
    title = await this.checkExistAndResolveTile(title)
    const category=this.categoryRepository.create({priority,title})
    await this.categoryRepository.save(category)
    return{
      message:publicMessage.created
    }
  }

  async checkExistAndResolveTile(title:string){
    title= title?.trim()?.toLowerCase()
    const category=await this.categoryRepository.findOneBy({title})
    if(category){
      throw new ConflictException(ConflictMessage.categoryTitle)
    }
    return title
  }

  findAll() {
    return this.categoryRepository.find({});
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
