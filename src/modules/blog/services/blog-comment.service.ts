import {   Inject, Injectable,  Scope, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogEntity } from '../entities/blog.entity';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

import { CommentsEntity } from '../entities/comment.entity';
import { BlogService } from './blog.service';
import { Repository } from 'typeorm';
import { BlogCommentDto } from '../dto/blog-comment.dto';
import { publicMessage } from 'src/common/enums/message.enum';

@Injectable({ scope: Scope.REQUEST })
export class BlogCommentService {

    constructor(
        @Inject(REQUEST) private request: Request,
        @InjectRepository(BlogEntity) private blogRepository: Repository<BlogEntity>,
        @InjectRepository(CommentsEntity) private blogCommentRepository: Repository<CommentsEntity>
        , private blogService: BlogService
    ) { }


     async create(blogCommentDto:BlogCommentDto){
        const {id:userId}=this.request.user
        const {blogId,parentId,text}=blogCommentDto
        const blog=await this.blogService.checkExistBlogById(blogId)
        let parent =null
        if(parentId &&!isNaN(parentId)){
            parent =await this.blogCommentRepository.findOneBy({id:+parentId})
        }
        await this.blogCommentRepository.insert({
            text,
            accepted:true,
            blogId,
            parentId:parent?parentId:null,
            userId
        })
        return{
            message:publicMessage.CreatedComment
        }
    }


    






}
