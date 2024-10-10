import { ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import {  IsNotEmpty,  IsNumberString, IsOptional, Length } from "class-validator";

 export class BlogCommentDto {
    @ApiProperty()
    @IsNotEmpty()
    @Length(5)
    text:string
    
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumberString()
    parentId:number
    
    

    @ApiProperty()
    @IsNumberString()
    blogId:number

 }

 