import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthDto,  CheckOtpDto } from './dto/auth.dto';
import { swaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
import { Request, Response } from 'express';
import { request } from 'http';
import { AuthGuard } from './guard/auth.guard';
import { CanAccess } from 'src/common/decorators/role.decorator';
import { Roles } from 'src/common/enums/role.enum';
import { AuthDecorator } from 'src/common/decorators/auth.decorator';

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


  @Get("/check-guard")
  @ApiBearerAuth("Authorization")
  @UseGuards(AuthGuard)
  checkGuard(@Req() req:Request){
    return req.user
  }
}
 