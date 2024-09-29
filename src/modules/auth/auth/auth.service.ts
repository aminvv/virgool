import { BadRequestException, ConflictException, Inject, Injectable, Scope, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthType } from './enums/type.enums';
import { AuthMethod } from './enums/method.enums';
import { isEmail, isMobilePhone } from 'class-validator';
import { UserEntity } from 'src/modules/user/user/entities/user.entity';
import { Code, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthMessage, BadRequestMessage, publicMessage } from 'src/common/enums/message.enum';
import { OtpEntity } from 'src/modules/user/user/entities/otp.entity';
import { ProfileEntity } from 'src/modules/user/user/entities/profile.entity';
import { randomInt } from 'crypto';
import { TokenService } from './token.service';
import { Request, Response } from 'express';
import { CookieKeys } from 'src/common/enums/cookie.enum';
import { AuthResponse } from './enums/response';
import { REQUEST } from '@nestjs/core';
import { CookieOptionsToken } from 'src/common/utils/cookie.util';

@Injectable({scope:Scope.REQUEST})
export class AuthService {

    constructor(
        @Inject(REQUEST) private request:Request,
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
        @InjectRepository(ProfileEntity) private profileRepository: Repository<ProfileEntity>,
        @InjectRepository(OtpEntity) private otpRepository: Repository<OtpEntity>,
        private tokenService: TokenService,
    ) { }


    async userExistence(AuthDto: AuthDto, res: Response) {
        const { method, type, username } = AuthDto
        let result:AuthResponse
        switch (type) {
            case AuthType.Login: {
                 result=await  this.login(method, username)
                 return this.sendResponse(res,result)
            }

            case AuthType.Register: {
                 result= await this.register(method, username)
                 return this.sendResponse(res,result)
            }

            default:
                throw new UnauthorizedException()

        }
    }



    async sendResponse(res:Response ,result:AuthResponse){
        const{token,code}=result
        res.cookie(CookieKeys.OTP,token,CookieOptionsToken())
        res.json({
            token,
            code
        })
    }

    async checkOtp(code:string){
        const token= this.request.cookies?.[CookieKeys.OTP]
        if(!token) throw new UnauthorizedException(AuthMessage.ExpiredCode)
            const {userId}=this.tokenService.verifyOtpToken(token)
            const otp=await this.otpRepository.findOneBy({userId})
            if(!otp)throw new UnauthorizedException(AuthMessage.loginAgain)
                if(otp.expiresIn < new Date())throw new UnauthorizedException(AuthMessage.TryAgain)
                    if(otp.code !== code)throw new UnauthorizedException(AuthMessage.TryAgain)
                        const  accessToken=this.tokenService.createAccessToken({userId})
                        if(otp.method===AuthMethod.Email){
                            await this.userRepository.update({id:userId},{verify_email:true})
                        }else if(otp.method ===AuthMethod.phone){
                            await this.userRepository.update({id:userId},{verify_phone:true})
                        }
                        return {
                            message:publicMessage.loggedIn,
                            accessToken

                        }

    }

    async login(method: AuthMethod, username: string) {
        const validatedUsername = this.usernameValidator(method, username);
        let user: UserEntity = await this.checkExistUser(method, validatedUsername)
        if (!user) { throw new UnauthorizedException(AuthMessage.NotFoundAccount) }
        const otp = await this.createAndSaveOtp(user.id,method)
        const token=this.tokenService.createOtpToken({userId:user.id})
        return {
            token,
            code: otp.code,
           
        }



    }

    async register(method: AuthMethod, username: string) {
        const validatedUsername = this.usernameValidator(method, username);
        let user: UserEntity = await this.checkExistUser(method, validatedUsername)
        if (user) { throw new ConflictException(AuthMessage.AlreadyExistAccount) }
        if (AuthMethod.Username === method) {
            throw new BadRequestException(BadRequestMessage.InValidRegisterData)
        }
        user = this.userRepository.create({ [method]: username })
        user = await this.userRepository.save(user)
        user.username = `Us-${user.id}`
        await this.userRepository.save(user)
        const otp = await this.createAndSaveOtp(user.id,method)

        const token=this.tokenService.createOtpToken({userId:user.id})

        return { 

            code: otp.code,
            token
            }
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


    async createAndSaveOtp(userId: number ,method:AuthMethod) {  
        const code = randomInt(10000, 99999).toString()
        const expiresIn = new Date(new Date().getTime() + 1000 * 60 * 2)
        let existOtp = false
        let otp = await this.otpRepository.findOneBy({ userId })
        if (otp) {
            existOtp = true
            otp.code = code
            otp.expiresIn = expiresIn
            otp.method=method
        } else {
            otp = this.otpRepository.create({
                code,
                expiresIn,
                userId,
                method
            })
        }
        otp = await this.otpRepository.save(otp)
        if (!existOtp) {
            await this.userRepository.update({ id: userId }, { otpId: otp.id })
        }
        return otp



    }

    async validationAccessToken(token:string){
        const {userId}= this.tokenService.VerifyAccessToken(token)
        const user=await this.userRepository.findOneBy({id:userId})
        if(!user)throw new UnauthorizedException(AuthMessage.loginAgain);
        return user
        
    }





}
