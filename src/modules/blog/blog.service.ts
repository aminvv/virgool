import { BadRequestException, Get, Inject, Injectable, NotFoundException, Query, Scope, Search } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogEntity } from './entities/blog.entity';
import { FindOptionsWhere, QueryBuilder, Repository } from 'typeorm';
import { CreateBlogDto, filterBlogDto } from './dto/blog.dto';
import { createSlug, RandomId } from 'src/common/utils/functions.util';
import { REQUEST } from '@nestjs/core';
import { BlogStatus } from './enum/status.enum';
import { Request } from 'express';
import { BadRequestMessage, NotFoundMessage, publicMessage } from 'src/common/enums/message.enum';
import { paginationDto } from 'src/common/dtos/pagination.dto';
import { paginationGenerator, paginationSolver } from 'src/common/utils/pagination.util';
import { pagination } from 'src/common/decorators/pagination.decorator';
import { CategoryService } from '../category/category.service';
import { isArray } from 'class-validator';
import { BlogCategoryEntity } from './entities/blog.category.entity';
import { title } from 'process';
import { EntityName } from 'src/common/enums/entity.enum';
import { take } from 'rxjs';

@Injectable({ scope: Scope.REQUEST })
export class BlogService {

    constructor(
        @Inject(REQUEST) private request: Request,
        @InjectRepository(BlogEntity) private blogRepository: Repository<BlogEntity>,
        @InjectRepository(BlogCategoryEntity) private blogCategoryRepository: Repository<BlogCategoryEntity>
        , private categoryService: CategoryService
    ) { }
    async create(blogDto: CreateBlogDto) {
        const user = this.request.user
        let { title, slug, content, description, image, time_for_study, categories } = blogDto
        if (!isArray(categories) && typeof categories === "string") {
            categories = categories.split(",")
        } else if (!isArray(categories)) {
            throw new BadRequestException(BadRequestMessage.InvalidCategory)
        }

        let slugData = slug ?? title
        slug = createSlug(slugData)
        const isExist = await this.checkBlogBySlug(slug)
        if (isExist) {
            slug += `-${RandomId()}`
        }
        let blog = this.blogRepository.create({
            authorId: user.id,
            time_for_study,
            status: BlogStatus.Draft,
            description,
            content,
            title,
            slug,
            image,
        })
        blog = await this.blogRepository.save(blog)
        for (const categoryTitle of categories) {
            let category = await this.categoryService.findOneByTitle(categoryTitle)
            if (!category) {
                category = await this.categoryService.insertByTitle(categoryTitle)
            }
            await this.blogCategoryRepository.insert({
                blogId: blog.id,
                categoryId: category.id
            })
        }
        return {
            message: publicMessage.created
        }
    }



    async checkBlogBySlug(slug: string) {
        const blog = await this.blogRepository.findOneBy({ slug })
        return !!blog
    }



    async myBlog() {
        const { id } = this.request.user
        return await this.blogRepository.find({
            where: {
                authorId: id
            },
            order: {
                id: "DESC"
            }
        })
    }

    async blogList(paginationDto: paginationDto, filterBlogDto: filterBlogDto) {
        const { limit, page, skip } = paginationSolver(paginationDto)
        let { category, search } = filterBlogDto
        let where = ''
       



        
            // Initialize a parameters object for query parameters
            const parameters: any = {};
        
            if (category && category.trim() !== '') {
                category = category.toLowerCase();
                if (where.length > 0) where += ' AND ';
                where += 'category.title = :category';
                parameters.category = category; // Add category to parameters
            }
        
            if (search && search.trim() !== '') {
                if (where.length > 0) where += ' AND ';
                search = `%${search.toLowerCase()}%`;
                where += 'CONCAT(blog.title, blog.description, blog.content) ILIKE :search';
                parameters.search = search; // Add search to parameters
            }
        
            // If there are no filters, return an empty array and count
            if (where.length === 0) {
            }
        
            console.log(where); // Optional: Logging the where clause for debugging
        
            const [blog, count] = await this.blogRepository.createQueryBuilder(EntityName.Blog)
                .leftJoin("blog.categories", "categories")
                .leftJoin("categories.category", "category")
                .addSelect(['categories.id', 'category.title'])
                .where(where, parameters)
                .orderBy("blog.id", 'DESC')
                .skip(skip)
                .take(limit)
                .getManyAndCount();



        //---------------------ASK  CODI------------------------------------------- 

        // const whereConditions = [];
        // const parameters: any = {};

        // // Validate and sanitize category
        // if (category) {
        //     const sanitizedCategory = category.toLowerCase();
        //     whereConditions.push('category.title = :category');
        //     parameters.category = sanitizedCategory;
        // }

        // // Validate and sanitize search
        // if (search) {
        //     const sanitizedSearch = `%${search}%`;
        //     whereConditions.push('CONCAT(blog.title, blog.description, blog.content) ILIKE :search');
        //     parameters.search = sanitizedSearch;
        // }

        // const whereClause = whereConditions.length > 0 ? whereConditions.join(' AND ') : '';
        // const [blog, count] = await this.blogRepository.createQueryBuilder( EntityName.Blog )
        //     .leftJoin("blog.categories","categories")
        //     .leftJoin("categories.category","category")
        //     .addSelect(['categories.id','category.title'])
        //     .where(whereClause,parameters)

        //-------------------------------------------------------------------------





        // const [blogs, count] = await this.blogRepository.findAndCount({
        //     relations:{
        //         categories:{
        //             category:true
        //         }
        //     },
        //     where,
        //     select:{
        //         categories:{
        //             id:true,
        //             category:{
        //                 id:true,
        //                 title:true
        //             }
        //         }
        //     },
        //     order: {
        //         id: "DESC"
        //     },
        //     skip,
        //     take: limit,
        // });


        return {
            pagination: paginationGenerator(count, page, limit),
            blog
        }

    }

    async checkExistBlogById(id: number) {
        const blog = await this.blogRepository.findOneBy({ id })
        if (!blog) throw new NotFoundException(NotFoundMessage.NotFoundPost)
        return blog
    }

    async delete(id: number) {
        await this.checkExistBlogById(id)
        await this.blogRepository.delete({ id })
        return {
            message: publicMessage.Delete
        }
    }

}
