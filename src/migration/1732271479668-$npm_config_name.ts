import { EntityName } from "src/common/enums/entity.enum";
import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class  $npmConfigName1732271479668 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name:EntityName.User,
                columns:[
                    {name:"id",isPrimary:true, type:"serial",isNullable:true},
                    {name:"username", type:"character varying(50)",isNullable:true,isUnique:true},
                    {name:"phone", type:"character varying(12)",isNullable:true,isUnique:true},
                    {name:"email", type:"character varying(100)",isNullable:true,isUnique:true},
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // const userTable=await queryRunner.hasTable(EntityName.User)
        // if(userTable) await queryRunner.dropTable(EntityName.User)
        // or userTable ===>>> (true)
        await queryRunner.dropTable(EntityName.User,true)

    }

}
 