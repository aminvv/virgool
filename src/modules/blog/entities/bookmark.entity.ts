import { BaseEntityCustom } from "src/common/abstracts/base.entity";
import { EntityName } from "src/common/enums/entity.enum";
import { UserEntity } from "src/modules/user/entities/user.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { BlogEntity } from "./blog.entity";

@Entity(EntityName.BlogBookmarks)
 export class  BookmarksEntity extends BaseEntityCustom{
    @Column()
    blogId:number
    @Column()
    userId:number



    @ManyToOne(()=>UserEntity,user=>user.blogs_bookmarks,{onDelete:"CASCADE"})
    user:UserEntity 
    @ManyToOne(()=>BlogEntity,blog=>blog.bookmarks,{onDelete:"CASCADE"})
    blog:BlogEntity 

 }