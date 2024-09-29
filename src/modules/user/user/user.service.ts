import { BadRequestException, ConflictException, Inject, Injectable, Scope } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { profileDto } from './dto/profile.dto';
import { Request } from 'express';
import { profile } from 'console';
import { ProfileEntity } from './entities/profile.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { Gender } from 'src/common/enums/gender.enum';
import { isDate } from 'class-validator';
import { AuthMessage, BadRequestMessage, ConflictMessage, publicMessage } from 'src/common/enums/message.enum';
import { ProfileImage } from './types/files';
import { AuthService } from 'src/modules/auth/auth/auth.service';
import { TokenService } from 'src/modules/auth/auth/token.service';
import { OtpEntity } from './entities/otp.entity';
import { CookieKeys } from 'src/common/enums/cookie.enum';
import { AuthMethod } from 'src/modules/auth/auth/enums/method.enums';

@Injectable({ scope: Scope.REQUEST })
export class UserService {

  constructor(
    @Inject(REQUEST) private request: Request,
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    @InjectRepository(ProfileEntity) private profileRepository: Repository<ProfileEntity>,
    @InjectRepository(OtpEntity) private otpRepository: Repository<OtpEntity>,
    private authService: AuthService,
    private tokenService: TokenService,
  ) { }

  async changeProfile(files: ProfileImage, profileDto: profileDto) {

    if (files?.bg_image?.length > 0) {
      let [image] = files?.bg_image
      profileDto.bg_image = image?.path?.slice(7)
    }
    if (files?.image_profile?.length > 0) {
      let [image] = files?.image_profile
      profileDto.image_profile = image?.path?.slice(7)
    }


    const { id: userId, profileId } = this.request.user
    let profile = await this.profileRepository.findOneBy({ userId })

    const { bio, birthday, gender, linkedin_profile, nick_name, x_profile, bg_image, image_profile } = profileDto
    if (profile) {
      if (bio) profile.bio = bio
      if (gender && Object.values(Gender as any).includes(gender)) profile.gender = gender
      if (birthday && isDate(new Date(birthday))) profile.birthday = new Date(birthday)
      if (linkedin_profile) profile.linkedin_profile = linkedin_profile
      if (x_profile) profile.x_profile = x_profile
      if (nick_name) profile.nick_name = nick_name
      if (image_profile) profile.image_profile = image_profile
      if (bg_image) profile.bg_image = bg_image





    } else {
      profile = this.profileRepository.create({
        bio, birthday, gender, linkedin_profile, nick_name, x_profile, userId, image_profile, bg_image
      })



    }
    profile = await this.profileRepository.save(profile)
    if (!profileId) {
      await this.userRepository.update({ id: userId }, { profileId: profile.id })
    }
    return {
      message: publicMessage.Update
    }

  }


  profile() {
    const { id } = this.request.user
    return this.userRepository.findOne({
      where: { id },
      relations: ['profile']
    });
  }



  async changeEmail(email: string) {
    const { id } = this.request.user
    const user = await this.userRepository.findOneBy({ email })

    
    if (user && user?.id!== id) {
      throw new ConflictException(ConflictMessage.email)
    } else if (user && user?.id == id) {
      return {
        message: publicMessage.Update
      }
    }
    await this.userRepository.update({id},{new_email :email})
    console.log(email);
    
    const otp = await this.authService.createAndSaveOtp(id, AuthMethod.Email)
    
    const token = await this.tokenService.createEmailToken({ email })
    return {
      code: otp.code,
      token
    }

  }

  async  verifyEmail(code: string) { 
    const { id: userId, new_email } = this.request.user
    const token = this.request.cookies?.[CookieKeys.EmailOTP]
    if (!token) throw new BadRequestException(AuthMessage.ExpiredCode)
    const { email } = this.tokenService.VerifyEmailToken(token)
    if (email !== new_email) throw new BadRequestException(BadRequestMessage.SomeThingWrong)
    const otp = await this.checkOtp(code, userId)
    if(otp.method !==AuthMethod.Email)throw new BadRequestException(BadRequestMessage.SomeThingWrong)
      await this.userRepository.update({id:userId},{
        email,
        new_email:null,
        verify_email:true
      })
      return {
        message :publicMessage.Update,
        
      }
  }







  async changePhone(phone: string) {
    const { id } = this.request.user
    const user = await this.userRepository.findOneBy({ phone })

    
    if (user && user?.id!== id) {
      throw new ConflictException(ConflictMessage.phone)
    } else if (user && user?.id == id) {
      return {
        message: publicMessage.Update
      }
    }
    await this.userRepository.update({id},{new_phone :phone})
    const otp = await this.authService.createAndSaveOtp(id, AuthMethod.phone)
    
    const token = await this.tokenService.createPhoneToken({ phone })
    return {
      code: otp.code,
      token
    }

  }

  async  verifyPhone(code: string) { 
    const { id: userId, new_phone } = this.request.user
    const token = this.request.cookies?.[CookieKeys.PhoneOTP]
    if (!token) throw new BadRequestException(AuthMessage.ExpiredCode)
    const { phone } = this.tokenService.VerifyPhoneToken(token)
    if (phone !== new_phone) throw new BadRequestException(BadRequestMessage.SomeThingWrong)
    const otp = await this.checkOtp(code, userId)
    if(otp.method !==AuthMethod.phone)throw new BadRequestException(BadRequestMessage.SomeThingWrong)
      await this.userRepository.update({id:userId},{
        phone,
        new_phone:null,
        verify_email:true
      })
      return {
        message :publicMessage.Update,
        
      }
  }



  async checkOtp(code: string, userId: number) {
    const otp = await this.otpRepository.findOneBy({ userId })
    if (!otp) throw new BadRequestException(AuthMessage.loginAgain)
    if (otp.expiresIn < new Date()) throw new BadRequestException(AuthMessage.TryAgain)
    if (otp.code !== code) throw new BadRequestException(AuthMessage.TryAgain)
    return otp
  }
}
