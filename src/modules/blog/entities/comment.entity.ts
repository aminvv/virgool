import { BaseEntityCustom } from "src/common/abstracts/base.entity";
import { EntityName } from "src/common/enums/entity.enum";
import { UserEntity } from "src/modules/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { BlogEntity } from "./blog.entity";
import { join } from "path";

@Entity(EntityName.BlogComments)
 export class  CommentsEntity extends BaseEntityCustom{

    @Column()
    userId:number
    @Column()
    blogId:number
    @Column()
    text:string
    @Column({nullable:true})
    parentId:number
    @Column({default:false})
    accepted:boolean
    @CreateDateColumn()
    created_at:Date


    @ManyToOne(()=>CommentsEntity,parent=>parent.children,{onDelete:"CASCADE"})
    parent:CommentsEntity
    @OneToMany(()=>CommentsEntity,comment=>comment.parent)
    @JoinColumn({name:"parent"})
    children:CommentsEntity[]


    @ManyToOne(()=>UserEntity,user=>user.blog_comments,{onDelete:"CASCADE"})
    user:UserEntity

    @ManyToOne(()=>BlogEntity,blog=>blog.comments,{onDelete:"CASCADE"})
    blog:BlogEntity
 }


 