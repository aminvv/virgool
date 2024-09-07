import { BaseEntityCustom } from "src/common/abstracts/base.entity";
import { EntityName } from "src/common/enums/entity.enum";
import { Entity ,Column, CreateDateColumn, UpdateDateColumn} from "typeorm";

@Entity(EntityName.User)
export class UserEntity extends BaseEntityCustom {
    @Column({unique:true})
    username:string

    @Column({unique:true,nullable:true})
    phone:string

    @Column({nullable:true})
    password:string


    @Column({unique:true,nullable:true})
    email:string

    @CreateDateColumn()
    create_at:Date  

    @UpdateDateColumn()
    update_at:Date


}
