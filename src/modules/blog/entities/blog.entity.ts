import { BaseEntityCustom } from "src/common/abstracts/base.entity";
import { EntityName } from "src/common/enums/entity.enum";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, UpdateDateColumn } from "typeorm";
import { BlogStatus } from "../enum/status.enum";
import { UserEntity } from "src/modules/user/entities/user.entity";
import { BlogLikesEntity } from "./like.entity";

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



    @CreateDateColumn()
    create_at:Date
    @UpdateDateColumn()
    update_at:Date



    @ManyToOne(()=>UserEntity,user=>user.blogs,{onDelete:"CASCADE"})
    author:UserEntity[]

    @OneToMany(()=>BlogLikesEntity,like=>like.blog,{onDelete:"CASCADE"})
    likes:BlogLikesEntity[]

 }