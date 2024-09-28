import { BaseEntityCustom } from "src/common/abstracts/base.entity";
import { EntityName } from "src/common/enums/entity.enum";
import { Entity ,Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn} from "typeorm";
import { OtpEntity } from "./otp.entity";
import { ProfileEntity } from "./profile.entity";

@Entity(EntityName.User)
export class UserEntity extends BaseEntityCustom {
    @Column({unique:true ,nullable:true})
    username:string

    @Column({unique:true,nullable:true})
    phone:string

    
    @Column({unique:true,nullable:true})
    email:string
    

    @Column({nullable:true})
    new_email:string
    

    @Column({nullable:true,default:false})
    verify_email:boolean
    

    @Column({unique:true,default:false})
    verify_phone:boolean

    
    @Column({nullable:true})
    password:string
    

    @CreateDateColumn()
    create_at:Date  

    @UpdateDateColumn()
    update_at:Date

    @Column({nullable:true})
    otpId:number

    @OneToOne(()=>OtpEntity,otp=>otp.user,{nullable:true})
    @JoinColumn({name:"otpId"})
    otp:OtpEntity



    @Column({nullable:true})
    profileId:number

    @OneToOne(()=>ProfileEntity,profile=>profile.user)
    @JoinColumn({name:"profileId"})
    profile:ProfileEntity

}
