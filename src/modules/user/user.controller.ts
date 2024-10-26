import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UploadedFiles, ParseFilePipe, UseGuards, Res, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ChangEmailDto, ChangPhoneDto, ChangUsernameDto, profileDto } from './dto/profile.dto';
import { swaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerStorage } from 'src/common/utils/multer.util';
import { AuthGuard } from 'src/modules/auth/guard/auth.guard';
import { ProfileImage } from './types/files';
import { uploadedOptionalFiles } from 'src/common/decorators/upload-files.decorator';
import { CookieKeys } from 'src/common/enums/cookie.enum';
import { CookieOptionsToken } from 'src/common/utils/cookie.util';
import { publicMessage } from 'src/common/enums/message.enum';
import { Response } from 'express';
import { blokeDto, CheckOtpDto } from 'src/modules/auth/dto/auth.dto';
import { AuthDecorator } from 'src/common/decorators/auth.decorator';
import { paginationDto } from 'src/common/dtos/pagination.dto';
import { CanAccess } from 'src/common/decorators/role.decorator';
import { Roles } from 'src/common/enums/role.enum';

@Controller('user')
@ApiTags('user')
@AuthDecorator()
export class UserController {
  constructor(private readonly userService: UserService) { }



  @Patch("/profile")
  @ApiConsumes(swaggerConsumes.MultiPartData)
  @UseInterceptors(FileFieldsInterceptor(
    [
      { name: "image_profile", maxCount: 1 },
      { name: "bg_image", maxCount: 1 }
    ], {
    storage: multerStorage("user-profile")
  }))
  changeProfile(
    @uploadedOptionalFiles() files: ProfileImage,
    @Body() profileDto: profileDto) {
    return this.userService.changeProfile(files, profileDto);
  }

  @Get('/follow/:followingId')
  follow(@Param("followingId") followingId:number){
    return this.userService.follow(followingId)
  }

  @Get("/profile")
  profile() {
    return this.userService.profile()
  }


  @Get("/findAll")
  findAll() {
    return this.userService.findAll()
  }

  @Get("/followers")
   followers(@Query() pagination:paginationDto){
    return this.userService.followers(pagination)
   }

   @Get("/following")
   following(@Query() pagination:paginationDto){
    return this.userService.following(pagination)
   }


   @Post('/block')
  //  @CanAccess(Roles.Admin)
   @ApiConsumes(swaggerConsumes.UrlEncoded,swaggerConsumes.Json)
   blokeToggle(@Body() blokeDto:blokeDto){
    return this.userService.blokeToggle(blokeDto)
   }


  @Patch('/change-email')
  @ApiConsumes(swaggerConsumes.UrlEncoded,swaggerConsumes.Json)
  async changeEmail(@Body() ChangEmailDto: ChangEmailDto, @Res() res: Response) {
    const { code, token, message } = await this.userService.changeEmail(ChangEmailDto.email)
    if (message) return res.json({ message })
    res.cookie(CookieKeys.EmailOTP, token, CookieOptionsToken())
    res.json({
      code,
      message: publicMessage.SendOtp
    })
  }





  @Post('/change-email-otp')
  @ApiConsumes(swaggerConsumes.UrlEncoded,swaggerConsumes.Json)
  async verifyEmailOtp(@Body() otpDto: CheckOtpDto,) {
  return this.userService.verifyEmail(otpDto.code)
  }



  @Patch('/change-phone')
  @ApiConsumes(swaggerConsumes.UrlEncoded,swaggerConsumes.Json)
  async changePhone(@Body() ChangPhoneDto: ChangPhoneDto, @Res() res: Response) {
    const { code, token, message } = await this.userService.changePhone(ChangPhoneDto.Phone) 
    if (message) return res.json({ message })
    res.cookie(CookieKeys.PhoneOTP, token, CookieOptionsToken())
    res.json({
      code,
      message: publicMessage.SendOtp
    })
  }





  @Post('/change-phone-otp')
  @ApiConsumes(swaggerConsumes.UrlEncoded,swaggerConsumes.Json)
  async verifyPhoneOtp(@Body() otpDto: CheckOtpDto,) {
  return this.userService.verifyPhone(otpDto.code)
  }


  @Patch('/change-username')
  @ApiConsumes(swaggerConsumes.UrlEncoded,swaggerConsumes.Json)
  async changeUsername(@Body() changeUsername: ChangUsernameDto) {
  return this.userService.changeUsername(changeUsername.username)
  }
}



