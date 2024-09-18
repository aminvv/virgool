import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthDto,  CheckOtpDto } from './dto/auth.dto';
import { swaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
import { Response } from 'express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}



  @Post('/user-existence')
  @ApiConsumes(swaggerConsumes.UrlEncoded,swaggerConsumes.Json)
  userExistence(@Body() AuthDto:AuthDto ,@Res()res:Response){
    const result= this.authService.userExistence(AuthDto ,res)
   
  }


  @Post("/checkOtp")
  @ApiConsumes(swaggerConsumes.UrlEncoded,swaggerConsumes.Json)
  checkOtp(@Body() checkOtpDto:CheckOtpDto){
    return this.authService.checkOtp(checkOtpDto.code)
  }
}
 