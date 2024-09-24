import { Inject, Injectable, Scope } from '@nestjs/common';
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
import { publicMessage } from 'src/common/enums/message.enum';

@Injectable({ scope: Scope.REQUEST })
export class UserService {

  constructor(
    @Inject(REQUEST) private request: Request,
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    @InjectRepository(ProfileEntity) private profileRepository: Repository<ProfileEntity>,
  ) { }

  async changeProfile(files: any, profileDto: profileDto) {

    let { bg_image, image_profile } = files
    if (bg_image?.length > 0) {
      let [image] = bg_image
      profileDto.bg_image = image.path
    }
    if (image_profile?.length > 0) {
      let [image] = image_profile
      profileDto.image_profile = image.path
    }


    const { id: userId, profileId } = this.request.user
    const { bio, birthday, gender, linkedin_profile, nick_name, x_profile } = profileDto
    let profile = await this.profileRepository.findOneBy({ id: userId })
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
    return publicMessage.Inserted
 
  }
}
 