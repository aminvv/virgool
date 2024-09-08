import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthDto } from './dto/auth.dto';
import { swaggerConsumes } from 'src/common/enums/swagger-consumes.enum';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}



  @Post('/user-existence')
  @ApiConsumes(swaggerConsumes.UrlEncoded,swaggerConsumes.Json)
  userExistence(@Body() AuthDto:AuthDto){
    return this.authService.userExistence(AuthDto)
  }
}
 