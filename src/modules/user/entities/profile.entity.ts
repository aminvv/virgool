import { ApiPropertyOptional } from "@nestjs/swagger";
import { Length } from "class-validator";
import { BaseEntityCustom } from "src/common/abstracts/base.entity";
import { EntityName } from "src/common/enums/entity.enum";
import { Gender } from "src/common/enums/gender.enum";
import {  Column, Entity, OneToOne } from "typeorm";
import { UserEntity } from "./user.entity";




@Entity(EntityName.Profile)
export class ProfileEntity extends BaseEntityCustom {

    @Column()
    nick_name: string

    @Column({ nullable: true })
    bio: string

    @Column({ nullable: true })
    image_profile: String

    @Column({ nullable: true  })
    bg_image: string

    @Column({ nullable: true, enum:Gender })
    gender: string

    @Column({ nullable: true})
    birthday: Date

    @Column({ nullable: true })
    linkedin_profile: string

    @Column({ nullable: true })
    x_profile: string


    @Column()
    userId:number

    @OneToOne(()=>UserEntity, user=>user.profile,{onDelete:"CASCADE"})
    user:UserEntity



}