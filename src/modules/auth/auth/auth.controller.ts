import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthDto } from './dto/auth.dto';
import { swaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
import { Response } from 'express';
import { CookieKeys } from 'src/common/enums/cookie.enum';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}



  @Post('/user-existence')
  @ApiConsumes(swaggerConsumes.UrlEncoded,swaggerConsumes.Json)
  userExistence(@Body() AuthDto:AuthDto ,@Res()res:Response){
    const result= this.authService.userExistence(AuthDto)
    res.cookie(CookieKeys.OTP,)
  }
}
 