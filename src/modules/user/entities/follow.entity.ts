import { BaseEntityCustom } from "src/common/abstracts/base.entity";
import { EntityName } from "src/common/enums/entity.enum";
import { Column, CreateDateColumn, Entity, ManyToOne } from "typeorm";
import { UserEntity } from "./user.entity";
@Entity(EntityName.follow)
export class followEntity extends BaseEntityCustom {
    @Column()
    followerId: number
    @Column()
    followingId: number
    @CreateDateColumn()
    create_at:Date




    @ManyToOne(() => UserEntity, (user) => user.followers, { onDelete: 'CASCADE' })
    follower: UserEntity;  
  
    @ManyToOne(() => UserEntity, (user) => user.following, { onDelete: 'CASCADE' })
    following: UserEntity; 
}