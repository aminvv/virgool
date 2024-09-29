import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UploadedFiles, ParseFilePipe, UseGuards, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ChangEmailDto, ChangPhoneDto, profileDto } from './dto/profile.dto';
import { swaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerStorage } from 'src/common/utils/multer.util';
import { AuthGuard } from 'src/modules/auth/auth/guard/auth.guard';
import { ProfileImage } from './types/files';
import { uploadedOptionalFiles } from 'src/common/decorators/upload-files.decorator';
import { CookieKeys } from 'src/common/enums/cookie.enum';
import { CookieOptionsToken } from 'src/common/utils/cookie.util';
import { publicMessage } from 'src/common/enums/message.enum';
import { Response } from 'express';
import { CheckOtpDto } from 'src/modules/auth/auth/dto/auth.dto';

@Controller('user')
@ApiTags('user')
@ApiBearerAuth("Authorization")
@UseGuards(AuthGuard)
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



  @Get("/profile")
  profile() {
    return this.userService.profile()
  }



  @Patch('/change-email')
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
  async verifyEmailOtp(@Body() otpDto: CheckOtpDto,) {
  return this.userService.verifyEmail(otpDto.code)
  }



  @Patch('/change-phone')
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
  async verifyPhoneOtp(@Body() otpDto: CheckOtpDto,) {
  return this.userService.verifyPhone(otpDto.code)
  }
}



