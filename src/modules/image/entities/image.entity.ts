import { BaseEntityCustom } from "src/common/abstracts/base.entity";
import { EntityName } from "src/common/enums/entity.enum";
import { UserEntity } from "src/modules/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne } from "typeorm";
@Entity(EntityName.Image)
export class ImageEntity  extends BaseEntityCustom{
    @Column()
    name:string
    @Column()
    location:string
    @Column()
    alt:string
    @Column()
    userId:number
    @CreateDateColumn()
    created_at:Date
    @ManyToOne(()=>UserEntity,(user)=>user.images,{onDelete:"CASCADE"})
    user:UserEntity
}
