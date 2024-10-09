import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { IsArray, isArray, IsNotEmpty, IsNumber, IsNumberString, Length } from "class-validator";
import { EMPTY } from "rxjs";

 export class CreateBlogDto {
    @ApiProperty()
    @IsNotEmpty()
    @Length(10,150)
    title:string
    
    @ApiPropertyOptional({format:"binary"})
    image:string
    
    @ApiPropertyOptional({example:''})
    slug:string

    @ApiProperty()
    @IsNotEmpty()
    @IsNumberString()
    time_for_study:string
    
    @ApiProperty()
    @IsNotEmpty()
    @Length(10,300)
    description:string

    @ApiProperty()
    @IsNotEmpty()
    @Length(10,100)
    content:string


    @ApiProperty({type:String,isArray:true,})
    categories:string[] |string


 }
 export class updateBlogDto extends PartialType (CreateBlogDto) {}



 export class filterBlogDto{
   category:string
   search:string
 }


 