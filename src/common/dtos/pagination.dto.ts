import {  ApiPropertyOptional } from "@nestjs/swagger";


export class paginationDto{
    @ApiPropertyOptional()
    page:number

    @ApiPropertyOptional()
    limit:number
}