import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { profileDto } from './dto/profile.dto';
import { swaggerConsumes } from 'src/common/enums/swagger-consumes.enum';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}



  @Patch("/profile")
  @ApiConsumes(swaggerConsumes.MultiPartData)
  changeProfile( @Body() profileDto: profileDto) {
    return this.userService.changeProfile(profileDto);
  }

}
