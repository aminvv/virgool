import { ApiProperty } from "@nestjs/swagger"
import { AuthMethod } from "../enums/method.enums"
import { IsEnum, IsString ,Length} from "class-validator"
import { AuthType } from "../enums/type.enums"


export class AuthDto{

    @ApiProperty()
    @IsString()
    @Length(3,100)
    username:string
    

    @ApiProperty({enum:AuthMethod})
    @IsEnum(AuthMethod)
    method:AuthMethod


    @ApiProperty({enum:AuthType})
    @IsEnum(AuthType)
    type:AuthType
}


export class CheckOtpDto{

    @ApiProperty()
    @IsString()
    @Length(5,5)
    code:string
    
}

export class blokeDto{
    @ApiProperty()
    userId:number
}