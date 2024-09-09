import { BaseEntityCustom } from "src/common/abstracts/base.entity";
import { EntityName } from "src/common/enums/entity.enum";
import { Entity ,Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn} from "typeorm";
import { OtpEntity } from "./otp.entity";

@Entity(EntityName.User)
export class UserEntity extends BaseEntityCustom {
    @Column({unique:true ,nullable:true})
    username:string

    @Column({unique:true,nullable:true})
    phone:string

    @Column({nullable:true})
    password:string


    @Column({unique:true,nullable:true})
    email:string

    @CreateDateColumn()
    create_at:Date  

    @UpdateDateColumn()
    update_at:Date

    @Column({nullable:true})
    otpId:number

    @OneToOne(()=>OtpEntity,(otp)=>otp.user)
    @JoinColumn({name:"otpId"})
    otp:OtpEntity

}
