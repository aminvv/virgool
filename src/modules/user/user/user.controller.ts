import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UploadedFiles, ParseFilePipe, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { profileDto } from './dto/profile.dto';
import { swaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { multerDestination, multerFileName } from 'src/common/utils/multer.util';
import { AuthGuard } from 'src/modules/auth/auth/guard/auth.guard';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) { }



  @Patch("/profile")
  @ApiBearerAuth("Authorization")
  @UseGuards(AuthGuard)
  @ApiConsumes(swaggerConsumes.MultiPartData)
  @UseInterceptors(FileFieldsInterceptor(
    [{ name: "image_profile", maxCount: 1 },
    { name: "bg_image", maxCount: 1 }],
    {
      storage:diskStorage({
        destination:multerDestination("user-profile"),
        filename:multerFileName,
      })
    }
  ))
  changeProfile(
    @UploadedFiles(new ParseFilePipe(
      {fileIsRequired:false,
        validators:[]
      }
    ))files:any,
    @Body() profileDto: profileDto) {
    return this.userService.changeProfile(files, profileDto);
  }

}
 