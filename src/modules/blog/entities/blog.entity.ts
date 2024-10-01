import { BaseEntityCustom } from "src/common/abstracts/base.entity";
import { EntityName } from "src/common/enums/entity.enum";
import { Column, CreateDateColumn, Entity, UpdateDateColumn } from "typeorm";
import { BlogStatus } from "../enum/status.enum";

@Entity(EntityName.Blog)
 export class BlogEntity extends BaseEntityCustom{
    @Column()
    title:string
    @Column()
    description:string
    @Column()
    content:string
    @Column()
    image:string
    @Column()
    authorId:string
    @Column({default:BlogStatus.Draft})
    status:string



    @CreateDateColumn()
    create_at:Date
    @UpdateDateColumn()
    update_at:Date

 }