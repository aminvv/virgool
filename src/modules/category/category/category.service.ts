import { ConflictException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { Repository } from 'typeorm';
import { ConflictMessage, publicMessage } from 'src/common/enums/message.enum';
import { paginationDto } from 'src/common/dtos/pagination.dto';
import { paginationGenerator, paginationSolver } from 'src/common/utils/pagination.util';
import { take } from 'rxjs';

@Injectable()
export class CategoryService {


  constructor(@InjectRepository(CategoryEntity) private categoryRepository: Repository<CategoryEntity>) { }
  async create(createCategoryDto: CreateCategoryDto) {
    let { priority, title } = createCategoryDto
    title = await this.checkExistAndResolveTile(title)
    const category = this.categoryRepository.create({ priority, title })
    await this.categoryRepository.save(category)
    return {
      message: publicMessage.created
    }
  }

  async checkExistAndResolveTile(title: string) {
    title = title?.trim()?.toLowerCase()
    const category = await this.categoryRepository.findOneBy({ title })
    if (category) {
      throw new ConflictException(ConflictMessage.categoryTitle)
    }
    return title
  }

  async findAll(paginationDto: paginationDto) {
    const { limit, page, skip } = paginationSolver(paginationDto)
    const [categories, count] = await this.categoryRepository.findAndCount({
      where:{},
      skip,
      take: limit,
    });
    console.log("skip---------------",skip);
    console.log("limit------------------",limit);
    


    return {
      pagination:paginationGenerator(count,page,limit),
      categories
}
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
