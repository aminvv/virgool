import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthType } from './enums/type.enums';
import { AuthMethod } from './enums/method.enums';
import { isEmail, isMobilePhone } from 'class-validator';
import { UserEntity } from 'src/modules/user/user/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthMessage, BadRequestMessage } from 'src/common/enums/message.enum';

@Injectable()
export class AuthService {

    constructor(@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>) { }


    userExistence(AuthDto: AuthDto) {
        const { method, type, username } = AuthDto
        switch (type) {
            case AuthType.Login: {
                return this.login(method, username)
            }

            case AuthType.Register: {
                return this.register(method, username)
            }

            default:
                throw new UnauthorizedException()

        }
    }

    async login(method: AuthMethod, username: string) {
        const validatedUsername = this.usernameValidator(method, username);
        let user : UserEntity =await this.checkExistUser(method,validatedUsername)
        if (!user) {
            throw new UnauthorizedException(AuthMessage.NotFoundAccount)
        }



    }




    async register(method: AuthMethod, username: string) {
        const validatedUsername = this.usernameValidator(method, username);
        let user : UserEntity =await this.checkExistUser(method,validatedUsername)
        if (!user) {
            throw new ConflictException(AuthMessage.AlreadyExistAccount)
        }

    }






    async checkExistUser(method: AuthMethod, username: string) {
        let user: UserEntity
        if (method === AuthMethod.Mobile) {
            let user = await this.userRepository.findOneBy({ phone: username })
        }
        else if (method === AuthMethod.Email) {
            let user = await this.userRepository.findOneBy({ email: username })
        }
        else if (method === AuthMethod.Username) {
            let user = await this.userRepository.findOneBy({  username })
        } else {
            throw new BadRequestException(BadRequestMessage.InValidLoginData)
        }
        return user 
    }


    usernameValidator(method: AuthMethod, username: string) {
        switch (method) {
            case AuthMethod.Email: {
                if (isEmail(username)) return username
                throw new BadRequestException("email format is incorrect")
            }
            case AuthMethod.Mobile: {
                if (isMobilePhone(username)) return username
                throw new BadRequestException("mobile format is incorrect")
            }
            case AuthMethod.Username: {
                return username

            }

            default:
        }
    }





}
