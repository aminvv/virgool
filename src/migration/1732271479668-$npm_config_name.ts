import { Roles } from "@common/common/enums/role.enum";
import { UserStatus } from "@common/common/enums/status.enum";
import { EntityName } from "src/common/enums/entity.enum";
import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class  $npmConfigName1732271479668 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name:"User",
                columns:[
                    {name:"id",isPrimary:true, type:"serial",isNullable:true},
                    {name:"username", type:"character varying(50)",isNullable:true,isUnique:true},
                    {name:"phone", type:"character varying(12)",isNullable:true,isUnique:true},
                    {name:"email", type:"character varying(100)",isNullable:true,isUnique:true},
                    {name:"role", type:"enum",enum:[Roles.Admin,Roles.User]},
                    {name:"status", type:"enum",enum:[UserStatus.Block,UserStatus.Report],isNullable:true},
                    {name:"new_email", type:"varchar(100)",isNullable:true},
                    {name:"new_phone", type:"varchar(100)",isNullable:true},
                    {name:"verify_phone", type:"boolean",isNullable:true,default:false},
                    {name:"verify_email", type:"boolean",isNullable:true,default:false},
                    {name:"password", type:"varchar(20)",isNullable:true},
                    {name:"created_at", type:"timestamp",default:"now()"},
                ]
            })
            ,true  //not user folder write true if notExist
        )
            //@ts-ignore
            await queryRunner.addColumn("User",{name:"balance",type:"numeric",isNullable:true ,default:0})

                                     // To manually delete a database
            // const balance=await queryRunner.hasColumn(EntityName.User,"balance")
            // if(!balance) await queryRunner.addColumn(EntityName.User,{name:"balance",type:"numeric",isNullable:true ,default:0})
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // const userTable=await queryRunner.hasTable(EntityName.User)
        // if(userTable) await queryRunner.dropTable(EntityName.User)
        // or userTable ===>>> (true)
        await queryRunner.dropTable(EntityName.User,true)

        // if not exist   .dropTable  write=
                                            //await queryRunner.dropColumn(EntityName.User,"balance")

    }

}
 