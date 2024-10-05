import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { Repository } from 'typeorm';
import { ConflictMessage, NotFoundMessage, publicMessage } from 'src/common/enums/message.enum';
import { paginationDto } from 'src/common/dtos/pagination.dto';
import { paginationGenerator, paginationSolver } from 'src/common/utils/pagination.util';
import { take } from 'rxjs';

@Injectable()
export class CategoryService {


  constructor(@InjectRepository(CategoryEntity) private categoryRepository: Repository<CategoryEntity>) { }
  async create(createCategoryDto: CreateCategoryDto) {
    let {  title,priority } = createCategoryDto
    if (priority === undefined) {
      priority = 0; // Default priority value, change this as per your logic
  }
    title = await this.checkExistAndResolveTitle(title)
    const category = this.categoryRepository.create({title,priority})
    await this.categoryRepository.save(category)
    return {
      message: publicMessage.created
    }
  }



  async insertByTitle(title: string) {
    const category =this.categoryRepository.create({ title })
    return await this.categoryRepository.save(category)

  }



  async checkExistAndResolveTitle(title: string) {
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
      where: {},
      skip,
      take: limit,
    });
    console.log("skip---------------", skip);
    console.log("categories------------------", categories);

    return {
      pagination: paginationGenerator(count, page, limit),
      categories
    }
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findBy({ id })
    if (!category) throw new NotFoundException(NotFoundMessage.NotFoundCategory)
    return category
  }



  async findOneByTitle(title: string) {
    return await this.categoryRepository.findOneBy({ title })

  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id)
    if (!category) { throw new NotFoundException(NotFoundMessage.NotFoundCategory) }
    const { priority, title } = updateCategoryDto
    await this.categoryRepository.update({ id }, { priority, title })
    return {
      message: publicMessage.Update
    }

  }

  async remove(id: number) {
    const category = this.findOne(id)
    if (!category) { throw new NotFoundException(NotFoundMessage.NotFoundCategory) }
    await this.categoryRepository.delete(id)
    return {
      message: publicMessage.Delete
    }
  }
}
