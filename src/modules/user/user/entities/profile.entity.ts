import { BaseEntityCustom } from "src/common/abstracts/base.entity";
import { EntityName } from "src/common/enums/entity.enum";
import { Column, Entity } from "typeorm";




@Entity(EntityName.Profile)
export class ProfileEntity extends BaseEntityCustom{
    
    @Column()
    nick_name:string

    @Column({nullable:true})
    bio:string

    @Column({nullable:true})
    image_profile:String

    @Column({nullable:true})
    bg_image:string

    @Column({nullable:true})
    gender:string

    @Column({nullable:true})
    birthday:Date

    @Column({nullable:true})
    linkedin_profile:string
}