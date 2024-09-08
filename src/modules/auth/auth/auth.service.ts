import { Injectable } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {


    userExistence(AuthDto:AuthDto){
        return AuthDto
    }





}
