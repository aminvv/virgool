import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, isArray, IsNotEmpty, IsNumber, IsNumberString, Length } from "class-validator";

 export class CreateBlogDto {
    @ApiProperty()
    @IsNotEmpty()
    @Length(10,150)
    title:string
    
    @ApiPropertyOptional({format:"binary"})
    image:string
    
    @ApiPropertyOptional()
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



 export class filterBlogDto{
   category:string
   search:string
 }