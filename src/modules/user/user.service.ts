import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { profileDto } from './dto/profile.dto';
import { Request } from 'express';
import { ProfileEntity } from './entities/profile.entity';
import { Gender } from 'src/common/enums/gender.enum';
import { isDate } from 'class-validator';
import { AuthMessage, BadRequestMessage, ConflictMessage, NotFoundMessage, publicMessage } from 'src/common/enums/message.enum';
import { ProfileImage } from './types/files';
import { AuthService } from 'src/modules/auth/auth.service';
import { TokenService } from 'src/modules/auth/token.service';
import { OtpEntity } from './entities/otp.entity';
import { CookieKeys } from 'src/common/enums/cookie.enum';
import { AuthMethod } from 'src/modules/auth/enums/method.enums';
import { followEntity } from './entities/follow.entity';
import { EntityName } from 'src/common/enums/entity.enum';
import { paginationDto } from 'src/common/dtos/pagination.dto';
import { paginationGenerator, paginationSolver } from 'src/common/utils/pagination.util';
import { blokeDto } from '../auth/dto/auth.dto';
import { UserStatus } from 'src/common/enums/status.enum';

@Injectable({ scope: Scope.REQUEST })
export class UserService {

  constructor(
    @Inject(REQUEST) private request: Request,
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    @InjectRepository(ProfileEntity) private profileRepository: Repository<ProfileEntity>,
    @InjectRepository(OtpEntity) private otpRepository: Repository<OtpEntity>,
    @InjectRepository(followEntity) private followRepository: Repository<followEntity>,
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
      if (image_profile) profile.image_profile = String(image_profile)
      if (bg_image) profile.bg_image = bg_image





    } else {
      profile = this.profileRepository.create({
        bg_image, bio, birthday, linkedin_profile, nick_name, x_profile, gender, image_profile: String(image_profile),
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
    return this.userRepository.createQueryBuilder(EntityName.User)
      .where(id)
      .leftJoinAndSelect('user.profile', 'profile')
      .loadRelationCountAndMap('user.followers', 'user.followers')
      .loadRelationCountAndMap('user.following', 'user.following')
      .getOne()
  }





  async findAll() {
    return await this.userRepository.find({ where: {} })
  }

  async changeEmail(email: string) {
    const { id } = this.request.user
    const user = await this.userRepository.findOneBy({ email })


    if (user && user?.id !== id) {
      throw new ConflictException(ConflictMessage.email)
    } else if (user && user?.id == id) {
      return {
        message: publicMessage.Update
      }
    }
    await this.userRepository.update({ id }, { new_email: email })
    console.log(email);

    const otp = await this.authService.createAndSaveOtp(id, AuthMethod.Email)

    const token = await this.tokenService.createEmailToken({ email })
    return {
      code: otp.code,
      token
    }

  }

  async verifyEmail(code: string) {
    const { id: userId, new_email } = this.request.user
    const token = this.request.cookies?.[CookieKeys.EmailOTP]
    if (!token) throw new BadRequestException(AuthMessage.ExpiredCode)
    const { email } = this.tokenService.VerifyEmailToken(token)
    if (email !== new_email) throw new BadRequestException(BadRequestMessage.SomeThingWrong)
    const otp = await this.checkOtp(code, userId)
    if (otp.method !== AuthMethod.Email) throw new BadRequestException(BadRequestMessage.SomeThingWrong)
    await this.userRepository.update({ id: userId }, {
      email,
      new_email: null,
      verify_email: true
    })
    return {
      message: publicMessage.Update,

    }
  }


  async follow(followingId: number) {
    const { id: userId } = this.request.user
    const following = this.userRepository.findOneBy({ id: followingId })
    if (!following) throw new NotFoundException(NotFoundMessage.NotFound)
    let message = publicMessage.followed
    const isFollowing = await this.followRepository.findOneBy({ followingId, followerId: userId })
    if (isFollowing) {
      await this.followRepository.remove(isFollowing)
      return message = publicMessage.unFollow
    } else {
      await this.followRepository.insert({ followingId, followerId: userId })
      return message
    }
  }

  async followers(pagination: paginationDto) {
    const { page, limit, skip } = paginationSolver(pagination)
    const { id: userId } = this.request.user
    const [followers, count] = await this.followRepository.findAndCount({
      where: { followerId: userId },
      relations: {
        follower: {
          profile: true
        }
      },
      select: {
        id: true,
        follower: {
          id: true,
          username: true,
          profile: {
            id: true,
            bio: true,
            nick_name: true,
            bg_image: true,
            image_profile: true,
          }
        }

      },
      skip,
      take: limit,
    })
    return {
      pagination: paginationGenerator(count, page, limit),
      followers
    }
  }

  async following(pagination: paginationDto) {
    const { page, limit, skip } = paginationSolver(pagination)
    const { id: userId } = this.request.user
    const [following, count] = await this.followRepository.findAndCount({
      where: { followingId: userId },
      relations: {
        following: {
          profile: true
        }
      },
      select: {
        id: true,
        follower: {
          id: true,
          username: true,
          profile: {
            id: true,
            bio: true,
            nick_name: true,
            bg_image: true,
            image_profile: true,
          }
        }
      },
      skip,
      take:limit
    })
    return{
      pagination:paginationGenerator(count,page,limit),
      following
    }
  }

  async changePhone(phone: string) {
    const { id } = this.request.user
    const user = await this.userRepository.findOneBy({ phone })


    if (user && user?.id !== id) {
      throw new ConflictException(ConflictMessage.phone)
    } else if (user && user?.id == id) {
      return {
        message: publicMessage.Update
      }
    }
    await this.userRepository.update({ id }, { new_phone: phone })
    const otp = await this.authService.createAndSaveOtp(id, AuthMethod.phone)

    const token = await this.tokenService.createPhoneToken({ phone })
    return {
      code: otp.code,
      token
    }

  }

  async verifyPhone(code: string) {
    const { id: userId, new_phone } = this.request.user
    const token = this.request.cookies?.[CookieKeys.PhoneOTP]
    if (!token) throw new BadRequestException(AuthMessage.ExpiredCode)
    const { phone } = this.tokenService.VerifyPhoneToken(token)
    if (phone !== new_phone) throw new BadRequestException(BadRequestMessage.SomeThingWrong)
    const otp = await this.checkOtp(code, userId)
    if (otp.method !== AuthMethod.phone) throw new BadRequestException(BadRequestMessage.SomeThingWrong)
    await this.userRepository.update({ id: userId }, {
      phone,
      new_phone: null,
      verify_email: true
    })
    return {
      message: publicMessage.Update,

    }
  }

  async blokeToggle(blokeDto:blokeDto){
    const{userId}=blokeDto
    const user=await this.userRepository.findOneBy({id:userId})
    if(!user)throw new NotFoundException(NotFoundMessage.NotFound)
      let message=publicMessage.Block
      if(user.status=== UserStatus.Block){
        await this.userRepository.update({id:userId},{status:null})
        message=publicMessage.UnBlock
      }else{
        await this.userRepository.update({id:userId},{status:UserStatus.Block})        
      }
      return{
        message
      }
  }





  async changeUsername(username: string) {
    const { id } = this.request.user
    const user = await this.userRepository.findOneBy({ username })


    if (user && user?.id !== id) {
      throw new ConflictException(ConflictMessage.username)
    } else if (user && user?.id == id) {
      return {
        message: publicMessage.Update
      }
    }
    await this.userRepository.update({ id }, { username })
    return {
      message: publicMessage.Update

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
