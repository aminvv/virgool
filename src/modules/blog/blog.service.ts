import { Get, Inject, Injectable, Query, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogEntity } from './entities/blog.entity';
import { Repository } from 'typeorm';
import { CreateBlogDto } from './dto/blog.dot';
import { createSlug, RandomId } from 'src/common/utils/functions.util';
import { REQUEST } from '@nestjs/core';
import { BlogStatus } from './enum/status.enum';
import { Request } from 'express';
import { publicMessage } from 'src/common/enums/message.enum';
import { paginationDto } from 'src/common/dtos/pagination.dto';
import { paginationGenerator, paginationSolver } from 'src/common/utils/pagination.util';
import { pagination } from 'src/common/decorators/pagination.decorator';

@Injectable({ scope: Scope.REQUEST })
export class BlogService {

    constructor(
        @Inject(REQUEST) private request: Request,
        @InjectRepository(BlogEntity) private blogRepository: Repository<BlogEntity>
    ){ }
    async create(blogDto: CreateBlogDto) {
        const user=this.request.user
        let { title, slug, content, description, image, time_for_study } = blogDto
        let slugData = slug ?? title
        slug = createSlug(slugData)
        const isExist=this.checkBlogBySlug(slug)
        if(isExist){
            slug+= `-${RandomId()}`
        }
        const blog = this.blogRepository.create({
            authorId:user.id,
            time_for_study,
            status: BlogStatus.Draft,
            description,
            content,
            title,
            slug,
            image,
        })
        await this.blogRepository.save(blog)
        return {
            message: publicMessage.created
        }
    }



    async checkBlogBySlug(slug:string){
        const blog=await this.blogRepository.findOneBy({slug})
        return !!blog
    }



    async myBlog(){
        const {id}=this.request.user
         return await this.blogRepository.find ({
            where:{
                authorId:id
            },
            order:{
                id:"DESC"
            }
        })
    }

    async blogList(paginationDto: paginationDto) {
        const { limit, page, skip } = paginationSolver(paginationDto)

        const [blogs, count] = await this.blogRepository.findAndCount({
            where: {},  // You can modify this filter criteria as needed
            order: {
                id: "DESC"
            },
            skip,
            take: limit,
        });
        return {
            pagination:paginationGenerator(count,page ,limit),
            blogs
        }

}

}
