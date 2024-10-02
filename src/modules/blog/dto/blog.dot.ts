import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsNumberString, Length } from "class-validator";

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
 }