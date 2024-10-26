import { BaseEntityCustom } from "src/common/abstracts/base.entity";
import { EntityName } from "src/common/enums/entity.enum";
import { Entity, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, OneToMany } from "typeorm";
import { OtpEntity } from "./otp.entity";
import { ProfileEntity } from "./profile.entity";
import { BlogEntity } from "src/modules/blog/entities/blog.entity";
import { BlogLikesEntity } from "src/modules/blog/entities/like.entity";
import { BookmarksEntity } from "src/modules/blog/entities/bookmark.entity";
import { CommentsEntity } from "src/modules/blog/entities/comment.entity";
import { ImageEntity } from "src/modules/image/entities/image.entity";
import { Roles } from "src/common/enums/role.enum";
import { followEntity } from "./follow.entity";
import { UserStatus } from "src/common/enums/status.enum";

@Entity(EntityName.User)
export class UserEntity extends BaseEntityCustom {
    @Column({ unique: true, nullable: true })
    username: string

    @Column({ unique: true, nullable: true })
    phone: string


    @Column({ unique: true, nullable: true })
    email: string


    @Column({ nullable: true })
    new_email: string


    @Column({ nullable: true })
    status:string


    @Column({ nullable: true, default: false })
    verify_email: boolean


    @Column({ nullable: true, default: false })
    verify_phone: boolean


    @Column({ nullable: true })
    new_phone: string


    @Column({ nullable: true })
    password: string


    @CreateDateColumn()
    create_at: Date

    @UpdateDateColumn()
    update_at: Date

    @Column({ nullable: true })
    otpId: number

    @Column({ default: Roles.User })
    role: string

    @OneToOne(() => OtpEntity, otp => otp.user, { nullable: true })
    @JoinColumn({ name: "otpId" })
    otp: OtpEntity



    @Column({ nullable: true })
    profileId: number

    @OneToOne(() => ProfileEntity, profile => profile.user)
    @JoinColumn({ name: "profileId" })
    profile: ProfileEntity


    @OneToMany(() => BlogEntity, blog => blog.author)
    blogs: BlogEntity[]


    @OneToMany(() => BlogLikesEntity, like => like.user)
    blogs_likes: BlogLikesEntity[]


    @OneToMany(() => BookmarksEntity, bookmark => bookmark.user)
    blogs_bookmarks: BookmarksEntity[]


    @OneToMany(() => CommentsEntity, comment => comment.user)
    blog_comments: CommentsEntity[]

    @OneToMany(() => ImageEntity, (image) => image.user)
    images: ImageEntity[]


    @OneToMany(() => followEntity, (follow) => follow.following)
    followers: followEntity[]; 
  
    @OneToMany(() => followEntity, (follow) => follow.follower)
    following: followEntity[];
}
