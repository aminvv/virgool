import { BaseEntityCustom } from "src/common/abstracts/base.entity";
import { EntityName } from "src/common/enums/entity.enum";
import { Column, Entity } from "typeorm";

@Entity(EntityName.Category)
export class CategoryEntity extends BaseEntityCustom {
     @Column()
     title:string

     @Column()
     priority:number
}
