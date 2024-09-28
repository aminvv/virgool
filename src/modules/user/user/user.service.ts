import { ConflictException, Inject, Injectable, Scope } from '@nestjs/common';
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
import { ConflictMessage, publicMessage } from 'src/common/enums/message.enum';
import { ProfileImage } from './types/files';
import { AuthService } from 'src/modules/auth/auth/auth.service';
import { TokenService } from 'src/modules/auth/auth/token.service';

@Injectable({ scope: Scope.REQUEST })
export class UserService {

  constructor(
    @Inject(REQUEST) private request: Request,
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    @InjectRepository(ProfileEntity) private profileRepository: Repository<ProfileEntity>,
    private authService:AuthService,
    private tokenService:TokenService ,
  ) { }

  async changeProfile(files: ProfileImage, profileDto: profileDto) {

    if (files?.bg_image?.length > 0) {
      let [image] =files?.bg_image
      profileDto.bg_image = image?.path?.slice(7)
    }
    if (files?.image_profile?.length > 0) {
      let [image] = files?.image_profile
      profileDto.image_profile = image?.path?.slice(7)
    }


    const { id: userId, profileId } = this.request.user
    let profile = await this.profileRepository.findOneBy({ userId })
    
    const { bio, birthday, gender, linkedin_profile, nick_name, x_profile ,bg_image,image_profile} = profileDto
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
        bio, birthday, gender, linkedin_profile, nick_name, x_profile, userId, image_profile,bg_image
      })
       
        
      
    }
    profile = await this.profileRepository.save(profile)
    if (!profileId) {
      await this.userRepository.update({ id: userId }, { profileId: profile.id })
    }
    return{
      message:publicMessage.Update
    }
 
  }


  profile(){
    const{id}=this.request.user
    return this.userRepository.findOne({
      where: { id },
      relations: ['profile']
    });
  }



  async changeEmail(email:string){
    const {id}=this.request.user
    const user=await this.userRepository.findOneBy({email})
    if( user&&user?.id!== id){
      throw new ConflictException(ConflictMessage.email)
    }else if( user&&user?.id!== id){
      return {
        message:publicMessage.Update
      }
    }
    user.new_email=email
    const otp=await this.authService.createAndSaveOtp(user.id)
    const token=await this.tokenService.createEmailToken({email})
    return {
      code:otp.code,
      token
    }

  }
}
  