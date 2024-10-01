import { BaseEntityCustom } from "src/common/abstracts/base.entity";
import { EntityName } from "src/common/enums/entity.enum";
import { Column, Entity, OneToOne } from "typeorm";
import { UserEntity } from "./user.entity";



@Entity(EntityName.Otp)
export class OtpEntity extends BaseEntityCustom{
    @Column()
    code:string
    
    @Column()
    userId:number

    @Column({nullable:true})
    method:string

    @Column()
    expiresIn:Date
    
    @OneToOne(()=>UserEntity,user=>user.otp,{onDelete:"CASCADE"})
    user:UserEntity


}