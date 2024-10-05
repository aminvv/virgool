import { BadRequestException, Get, Inject, Injectable, Query, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogEntity } from './entities/blog.entity';
import { Repository } from 'typeorm';
import { CreateBlogDto } from './dto/blog.dto';
import { createSlug, RandomId } from 'src/common/utils/functions.util';
import { REQUEST } from '@nestjs/core';
import { BlogStatus } from './enum/status.enum';
import { Request } from 'express';
import { BadRequestMessage, publicMessage } from 'src/common/enums/message.enum';
import { paginationDto } from 'src/common/dtos/pagination.dto';
import { paginationGenerator, paginationSolver } from 'src/common/utils/pagination.util';
import { pagination } from 'src/common/decorators/pagination.decorator';
import { CategoryService } from '../category/category.service';
import { isArray } from 'class-validator';
import { BlogCategoryEntity } from './entities/blog.category.entity';

@Injectable({ scope: Scope.REQUEST })
export class BlogService {

    constructor(
        @Inject(REQUEST) private request: Request,
        @InjectRepository(BlogEntity) private blogRepository: Repository<BlogEntity>,
        @InjectRepository(BlogCategoryEntity) private blogCategoryRepository: Repository<BlogCategoryEntity>
        ,private categoryService:CategoryService
    ){ }
    async create(blogDto: CreateBlogDto) {
        const user=this.request.user
        let { title, slug, content, description, image, time_for_study,categories } = blogDto
        if(!isArray (categories) && typeof categories ==="string"){
            categories=categories.split(",")
        }else if(!isArray (categories)){
            throw new BadRequestException(BadRequestMessage.InvalidCategory)
        }
        
        let slugData = slug ?? title
        slug = createSlug(slugData)
        const isExist= await this.checkBlogBySlug(slug)
        if(isExist){
            slug+= `-${RandomId()}`
        }
        let blog = this.blogRepository.create({
            authorId:user.id,
            time_for_study,
            status: BlogStatus.Draft,
            description,
            content,
            title,
            slug,
            image,
        })
        blog= await this.blogRepository.save(blog)
        for (const categoryTitle of categories) {
            let category=await this.categoryService.findOneByTitle(title)
            if(!category){
               category = await this.categoryService.insertByTitle(categoryTitle)
            }
            await this.blogCategoryRepository.insert({
                blogId:blog.id, 
                categoryId:category.id
            })
        }
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
            where: {},  
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
