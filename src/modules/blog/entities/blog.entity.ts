import { BaseEntityCustom } from "src/common/abstracts/base.entity";
import { EntityName } from "src/common/enums/entity.enum";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, UpdateDateColumn } from "typeorm";
import { BlogStatus } from "../enum/status.enum";
import { UserEntity } from "src/modules/user/entities/user.entity";
import { BlogLikesEntity } from "./like.entity";
import { BookmarksEntity } from "./bookmark.entity";
import { CommentsEntity } from "./comment.entity";
import { BlogCategoryEntity } from "./blog.category.entity";

@Entity(EntityName.Blog)
 export class BlogEntity extends BaseEntityCustom{
    @Column()
    title:string
    @Column()
    description:string
    @Column()
    content:string
    @Column({nullable:true})
    image:string
    @Column()
    authorId:string
    @Column({default:BlogStatus.Draft})
    status:string
    @Column({unique:true})
    slug:string
    @Column()
    time_for_study:string



    @CreateDateColumn()
    create_at:Date
    @UpdateDateColumn()
    update_at:Date



    @ManyToOne(()=>UserEntity,user=>user.blogs,{onDelete:"CASCADE"})
    author:UserEntity[]

    @OneToMany(()=>BlogLikesEntity,like=>like.blog,{onDelete:"CASCADE"})
    likes:BlogLikesEntity[]

    @OneToMany(()=>BookmarksEntity,bookmark=>bookmark.blog,{onDelete:"CASCADE"})
    bookmarks:BookmarksEntity[]


    @OneToMany(()=>CommentsEntity,comment=>comment.blog,{onDelete:"CASCADE"})
    comment:CommentsEntity[]

    @OneToMany(()=>BlogCategoryEntity,category=>category.blog ,{onDelete:"CASCADE"})
    category:BlogCategoryEntity[]
 }