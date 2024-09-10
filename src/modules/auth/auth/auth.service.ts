import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthType } from './enums/type.enums';
import { AuthMethod } from './enums/method.enums';
import { isEmail, isMobilePhone } from 'class-validator';
import { UserEntity } from 'src/modules/user/user/entities/user.entity';
import { Code, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthMessage, BadRequestMessage } from 'src/common/enums/message.enum';
import { OtpEntity } from 'src/modules/user/user/entities/otp.entity';
import { ProfileEntity } from 'src/modules/user/user/entities/profile.entity';
import { randomInt } from 'crypto';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
        @InjectRepository(ProfileEntity) private profileRepository: Repository<ProfileEntity>,
        @InjectRepository(OtpEntity) private otpRepository: Repository<OtpEntity>,
    ) { }


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
        let user: UserEntity = await this.checkExistUser(method, validatedUsername)
        if (!user) {throw new UnauthorizedException(AuthMessage.NotFoundAccount)}
        const otp = await this.createAndSaveOtp(user.id)
        return otp.code
        
        

    }

    async register(method: AuthMethod, username: string) {
        const validatedUsername = this.usernameValidator(method, username);
        let user: UserEntity = await this.checkExistUser(method, validatedUsername)
        if (user) {throw new ConflictException(AuthMessage.AlreadyExistAccount)}
        if(AuthMethod.Username === method){
            throw new BadRequestException(BadRequestMessage.InValidRegisterData)
        }
        user = this.userRepository.create({ [method]: username })
         user=await this. userRepository.save(user)
            user.username= `Us-${user.id}`
            await this. userRepository.save(user)
        const otp = await this.createAndSaveOtp(user.id)
        return otp.code
    }

    usernameValidator(method: AuthMethod, username: string) {
        switch (method) {
            case AuthMethod.Email: {
                if (isEmail(username)) return username
                throw new BadRequestException("email format is incorrect")
            }
            case AuthMethod.phone: {
                if (isMobilePhone(username)) return username
                throw new BadRequestException("mobile format is incorrect")
            }
            case AuthMethod.Username: {
                return username

            }

            default:
                throw new UnauthorizedException()

        }
    }

    
    
    async checkExistUser(method: AuthMethod, username: string) {
        let user: UserEntity
        if (method === AuthMethod.phone) {
             user = await this.userRepository.findOneBy({ phone: username })
        } 
        else if (method === AuthMethod.Email) {
             user = await this.userRepository.findOneBy({ email: username })
        }
        else if (method === AuthMethod.Username) {
             user = await this.userRepository.findOneBy({ username })
        } else {
            throw new BadRequestException(BadRequestMessage.InValidLoginData)
        }
        return user
    }
    
    
    


    async createAndSaveOtp(userId: number) {
        const code = randomInt(10000, 99999).toString()
        const expiresIn = new Date(new Date().getTime() + 1000 * 60 * 2)
        let existOtp = false
        let otp = await this.otpRepository.findOneBy({ userId })
        if (otp) {
            existOtp = true
            otp.code = code
            otp.expiresIn = expiresIn
        } else {
            otp = this.otpRepository.create({
                code,
                expiresIn,
                userId
            })
        }
        otp=await this.otpRepository.save(otp)
        if (!existOtp) {
            await this.userRepository.update({ id: userId }, { otpId: otp.id })
        }
        return otp
    
    
    
    }





}
