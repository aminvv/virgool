import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UploadedFiles, ParseFilePipe, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { profileDto } from './dto/profile.dto';
import { swaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { multerDestination, multerFileName, multerStorage } from 'src/common/utils/multer.util';
import { AuthGuard } from 'src/modules/auth/auth/guard/auth.guard';
import { ProfileImage } from './types/files';
import { uploadedOptionalFiles } from 'src/common/decorators/upload-files.decorator';

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
      storage:multerStorage("user-profile")
    }))
  changeProfile(
 @uploadedOptionalFiles()files:ProfileImage,
    @Body() profileDto: profileDto) {
    return this.userService.changeProfile(files, profileDto);
  }



  @Get("/profile")
  profile(){
    return this.userService.profile()
  }

}



 