import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException, Scope, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogEntity } from '../entities/blog.entity';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

import { CommentsEntity } from '../entities/comment.entity';
import { BlogService } from './blog.service';
import { IsNull, Repository } from 'typeorm';
import { BlogCommentDto } from '../dto/blog-comment.dto';
import { BadRequestMessage, NotFoundMessage, publicMessage } from 'src/common/enums/message.enum';
import { paginationGenerator, paginationSolver } from 'src/common/utils/pagination.util';
import { paginationDto } from 'src/common/dtos/pagination.dto';
import { pagination } from 'src/common/decorators/pagination.decorator';

@Injectable({ scope: Scope.REQUEST })
export class BlogCommentService {

    constructor(
        @Inject(REQUEST) private request: Request,
        @InjectRepository(BlogEntity) private blogRepository: Repository<BlogEntity>,
        @InjectRepository(CommentsEntity) private blogCommentRepository: Repository<CommentsEntity>
        , @Inject(forwardRef(() => BlogService)) private blogService: BlogService
    ) { }


    async create(blogCommentDto: BlogCommentDto) {
        const { id: userId } = this.request.user
        const { blogId, parentId, text } = blogCommentDto
        const blog = await this.blogService.checkExistBlogById(blogId)
        let parent = null
        if (parentId && !isNaN(parentId)) {
            parent = await this.blogCommentRepository.findOneBy({ id: +parentId })
        }
        await this.blogCommentRepository.insert({
            text,
            accepted: true,
            blogId,
            parentId: parent ? parentId : null,
            userId
        })
        return {
            message: publicMessage.CreatedComment
        }



    }
    async findComment(paginationDto: paginationDto) {
        const { limit, page, skip } = paginationSolver(paginationDto)
        const [comments, count] = await this.blogCommentRepository.findAndCount({
            where: {},
            relations: {
                blog: true,
                user: true
            },
            select: {
                blog: {
                    title: true
                },
                user: {
                    username: true,
                    profile: {
                        nick_name: true
                    }
                }
            },
            take: limit,
            skip,
        })
        return {
            pagination: paginationGenerator(limit, page, count),
            comments

        }
    }
    async checkExistById(id: number) {
        const comment = this.blogCommentRepository.findOneBy({ id })
        if (!comment) {
            throw new NotFoundException(NotFoundMessage.NotFound)
        }
        return comment
    }
    async acceptComment(id: number) {
        const comment = await this.checkExistById(id)
        if (comment.accepted) throw new BadRequestException(BadRequestMessage.AlreadyAccepted)
        comment.accepted = true
        await this.blogCommentRepository.save(comment)
        return {
            message: publicMessage.Update
        }
    }

    async rejectComment(id: number) {
        const comment = await this.checkExistById(id)
        if (!comment.accepted) throw new BadRequestException(BadRequestMessage.AlreadyRejected)
        comment.accepted = false
        await this.blogCommentRepository.save(comment)
        return {
            message: publicMessage.Update
        }
    }

    async findCommendOfBlog(blogId: number, paginationDto: paginationDto) {
        const { limit, page, skip } = paginationSolver(paginationDto)
        const [comments, count] = await this.blogCommentRepository.findAndCount({
            where: {
                blogId,
                parentId: IsNull()
            },
            relations: {

                user: { profile: true },
                children: {
                    user: { profile: true },
                    children: {
                        blog: true,
                        user: { profile: true }
                    }
                }
            },
            select: {
                user: {
                    username: true,
                    profile: {
                        nick_name: true
                    },

                },
                children: {
                    text:true,
                    parentId: true,
                    created_at: true,
                    user: {
                        username: true,
                        profile: {
                            nick_name: true,
                        },
                    },
                    children: {
                        text:true,
                        parentId: true,
                        created_at: true,
                        user: {
                            username: true,
                            profile: {
                                nick_name: true
                            }
                        }
                    }
                }
            },
            skip,
            take: limit
        })
        return {
            pagination: paginationGenerator(limit, page, count),
            comments
        }

    }







}
