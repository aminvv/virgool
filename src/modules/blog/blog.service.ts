import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogEntity } from './entities/blog.entity';
import { Repository } from 'typeorm';
import { CreateBlogDto } from './dto/blog.dot';
import { createSlug } from 'src/common/utils/functions.util';

@Injectable()
export class BlogService {
    constructor(@InjectRepository(BlogEntity)private blogRepository:Repository<BlogEntity>){}
    async create(blogDto:CreateBlogDto){
        let{title,slug}=blogDto
        let slugData=slug ?? title
        blogDto.slug=createSlug(slugData)
        return blogDto
    }
}
