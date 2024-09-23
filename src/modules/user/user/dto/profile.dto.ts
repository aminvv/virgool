import { ApiPropertyOptional } from "@nestjs/swagger"
import { Length } from "class-validator"
import { Gender } from "src/common/enums/gender.enum"

 export class profileDto{
    @ApiPropertyOptional()
    @Length(5,200)
    nick_name: string

    @ApiPropertyOptional({ nullable: true })
    @Length(3,100)
    bio: string

    @ApiPropertyOptional({ nullable: true ,format:"binary" })
    image_profile: String

    @ApiPropertyOptional({ nullable: true  ,format:"binary" })
    bg_image: string

    @ApiPropertyOptional({ nullable: true, enum:Gender })
    gender: string

    @ApiPropertyOptional({ nullable: true ,example:"1999-09-22T08:48:38.179Z"})
    birthday: Date

    @ApiPropertyOptional({ nullable: true })
    linkedin_profile: string

    @ApiPropertyOptional({ nullable: true })
    x_profile: string

 }