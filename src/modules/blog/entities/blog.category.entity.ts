import { BaseEntityCustom } from "src/common/abstracts/base.entity";
import { EntityName } from "src/common/enums/entity.enum";
import { Column, Entity, ManyToOne } from "typeorm";
import { BlogEntity } from "./blog.entity";
import { CategoryEntity } from "src/modules/category/entities/category.entity";

@Entity(EntityName.BlogCategory)
 export class BlogCategoryEntity extends BaseEntityCustom{
     @Column()
     blogId:number
     @Column()
     categoryId:number


     @ManyToOne(()=>BlogEntity,(blog)=>blog.category)
     blog:BlogEntity

     @ManyToOne(()=>CategoryEntity,category=>category.blog_category,{onDelete:"CASCADE"})
     category:CategoryEntity
 }